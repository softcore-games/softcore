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
  relationships: z.record(z.any()).optional().nullable(),
  emotions: z.record(z.string()),
  images: z.record(z.string()),
});

const importSchema = z.array(characterSchema);

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
    // Extract the characters array from the wrapper object if it exists
    const charactersData = Array.isArray(body) ? body : body.characters;
    
    if (!charactersData) {
      return NextResponse.json(
        { error: 'No characters data provided' },
        { status: 400 }
      );
    }

    const characters = importSchema.parse(charactersData);

    await prisma.$transaction(async (tx) => {
      // Clear existing characters
      await tx.character.deleteMany();

      // Import new characters
      for (const character of characters) {
        await tx.character.create({
          data: {
            ...character,
            relationships: character.relationships || undefined,
          },
        });
      }
    });

    return NextResponse.json({ message: 'Characters imported successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid character data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Failed to import characters:', error);
    return NextResponse.json(
      { error: 'Failed to import characters' },
      { status: 500 }
    );
  }
}