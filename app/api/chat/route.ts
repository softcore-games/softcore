import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AICharacterSystem } from '@/lib/game/AICharacterSystem';

export async function POST(request: Request) {
  try {
    const { userId, characterId, message, context } = await request.json();
    
    // Get or create chat history
    let chatHistory = await prisma.chatHistory.findFirst({
      where: {
        userId,
        characterId,
      },
    });

    if (!chatHistory) {
      chatHistory = await prisma.chatHistory.create({
        data: {
          userId,
          characterId,
          messages: [],
          relationshipValue: 0,
        },
      });
    }

    // Generate AI response
    const aiSystem = new AICharacterSystem(process.env.NEXT_PUBLIC_OPENAI_API_KEY || '');
    const response = await aiSystem.generateResponse(characterId, message, context);

    // Update chat history with new messages
    const updatedChatHistory = await prisma.chatHistory.update({
      where: {
        id: chatHistory.id,
      },
      data: {
        messages: {
          push: [
            {
              role: 'user',
              content: message,
              timestamp: new Date(),
            },
            {
              role: 'assistant',
              content: response,
              timestamp: new Date(),
            },
          ],
        },
        relationshipValue: context.relationshipValue ?? chatHistory.relationshipValue,
      },
    });

    return NextResponse.json({
      success: true,
      response,
      chatHistory: updatedChatHistory.messages,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process chat' },
      { status: 500 }
    );
  }
}