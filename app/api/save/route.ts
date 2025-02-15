import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { z } from 'zod';

const saveRequestSchema = z.object({
  progress: z.record(z.any()),
  relationships: z.record(z.any()),
  choices: z.record(z.any()),
  settings: z.object({
    volume: z.number(),
    textSpeed: z.enum(['slow', 'normal', 'fast']),
    autoplay: z.boolean(),
  }),
});

export async function POST(req: Request) {
  try {
    const accessToken = req.headers.get('authorization')?.split(' ')[1];
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verify(accessToken, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
    };

    const body = await req.json();
    const gameData = saveRequestSchema.parse(body);

    // Update or create game state
    const gameState = await prisma.gameState.upsert({
      where: {
        userId: decoded.userId,
      },
      update: {
        progress: gameData.progress,
        relationships: gameData.relationships,
        choices: gameData.choices,
        settings: gameData.settings,
        lastSaved: new Date(),
      },
      create: {
        userId: decoded.userId,
        progress: gameData.progress,
        relationships: gameData.relationships,
        choices: gameData.choices,
        settings: gameData.settings,
      },
    });

    return NextResponse.json({ gameState });
  } catch (error) {
    console.error('Save game error:', error);
    return NextResponse.json(
      { error: 'Failed to save game' },
      { status: 500 }
    );
  }
}