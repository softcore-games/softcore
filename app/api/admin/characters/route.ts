import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const characterSchema = z.object({
  characterId: z.string(),
  name: z.string(),
  personality: z.string(),
  background: z.string(),
  traits: z.array(z.string()),
  relationships: z.record(z.any()).optional(),
  emotions: z.record(z.string()),
  images: z.record(z.any()),
});

async function isAdmin(token: string) {
  try {
    const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
      isAdmin: boolean;
    };

    if (typeof decoded.isAdmin === 'boolean') {
      return decoded.isAdmin;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { isAdmin: true },
    });
    return user?.isAdmin || false;
  } catch {
    return false;
  }
}

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminCheck = await isAdmin(token);
  if (!adminCheck) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const characters = await prisma.character.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ characters });
  } catch (error) {
    console.error('Failed to fetch characters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminCheck = await isAdmin(token);
  if (!adminCheck) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const character = characterSchema.parse(body);

    const createdCharacter = await prisma.character.create({
      data: character,
    });

    return NextResponse.json({ character: createdCharacter }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid character data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Failed to create character:', error);
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    );
  }
}