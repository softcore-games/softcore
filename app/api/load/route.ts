import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

export async function GET(req: Request) {
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

    const gameState = await prisma.gameState.findUnique({
      where: {
        userId: decoded.userId,
      },
    });

    if (!gameState) {
      return NextResponse.json(
        { error: 'No saved game found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ gameState });
  } catch (error) {
    console.error('Load game error:', error);
    return NextResponse.json(
      { error: 'Failed to load game' },
      { status: 500 }
    );
  }
}