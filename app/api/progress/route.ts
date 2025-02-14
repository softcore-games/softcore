import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const progress = await prisma.gameProgress.findUnique({
      where: { userId },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, ...progressData } = data;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const progress = await prisma.gameProgress.upsert({
      where: { userId },
      update: {
        ...progressData,
        lastSaved: new Date(),
      },
      create: {
        userId,
        ...progressData,
        lastSaved: new Date(),
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Save progress error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}