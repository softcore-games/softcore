import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

async function getUser(token: string) {
  try {
    const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
    };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = await getUser(token);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const scenes = await prisma.scene.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // Parse and validate the scenes
    const validatedScenes = scenes.map(scene => {
      // Parse choices if they exist
      const parsedChoices = scene.choices 
        ? (typeof scene.choices === 'string' 
            ? JSON.parse(scene.choices) 
            : scene.choices)
        : null;

      // Parse metadata if it exists
      const parsedMetadata = scene.metadata
        ? (typeof scene.metadata === 'string'
            ? JSON.parse(scene.metadata)
            : scene.metadata)
        : null;

      return {
        ...scene,
        choices: parsedChoices,
        metadata: parsedMetadata,
      };
    });

    return NextResponse.json({ scenes: validatedScenes });
  } catch (error) {
    console.error('Failed to fetch scenes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scenes' },
      { status: 500 }
    );
  }
}