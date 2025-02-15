import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { ObjectId } from 'mongodb';

const characterSchema = z.object({
  characterId: z.string(),
  name: z.string(),
  personality: z.string(),
  background: z.string(),
  traits: z.array(z.string()),
  relationships: z.record(z.any()).optional(),
  emotions: z.record(z.string()),
  images: z.record(z.string()),
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const updatedCharacter = await prisma.character.update({
      where: { id: params.id },
      data: character,
    });

    return NextResponse.json({ character: updatedCharacter });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid character data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Failed to update character:', error);
    return NextResponse.json(
      { error: 'Failed to update character' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    // Validate that the ID is a valid MongoDB ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid character ID' },
        { status: 400 }
      );
    }

    // Check if the character exists before attempting to delete
    const character = await prisma.character.findUnique({
      where: { id: params.id },
    });

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    await prisma.character.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Character deleted successfully' });
  } catch (error) {
    console.error('Failed to delete character:', error);
    return NextResponse.json(
      { error: 'Failed to delete character' },
      { status: 500 }
    );
  }
}