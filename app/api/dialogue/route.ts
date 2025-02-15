import { NextResponse } from 'next/server';
import { generateResponse, getCachedResponse, cacheResponse } from '@/lib/openai';
import { z } from 'zod';

const dialogueRequestSchema = z.object({
  character: z.string(),
  context: z.string(),
  playerChoice: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { character, context, playerChoice } = dialogueRequestSchema.parse(body);

    // Generate cache key
    const cacheKey = `${character}-${context}-${playerChoice || ''}`;
    
    // Check cache first
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) {
      return NextResponse.json({ response: cachedResponse });
    }

    // Generate new response
    const response = await generateResponse(character, context, playerChoice);
    
    // Only cache if we got a valid response
    if (response) {
      cacheResponse(cacheKey, response);
    }

    return NextResponse.json({ 
      response: response || 'I\'m not sure how to respond to that right now.' 
    });
  } catch (error) {
    console.error('Dialogue generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate dialogue' },
      { status: 500 }
    );
  }
}