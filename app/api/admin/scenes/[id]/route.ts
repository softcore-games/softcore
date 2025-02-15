import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { ObjectId } from 'mongodb';

const sceneSchema = z.object({
  sceneId: z.string(),
  character: z.string(),
  emotion: z.string(),
  text: z.string(),
  next: z.string().optional(),
  choices: z.array(z.object({
    text: z.string(),
    next: z.string(),
  })).optional(),
  context: z.string().optional(),
  requiresAI: z.boolean(),
  background: z.string().optional(),
  type: z.string(),
  metadata: z.record(z.any()).optional(),
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
    const scene = sceneSchema.parse(body);

    const updatedScene = await prisma.scene.update({
      where: { id: params.id },
      data: scene,
    });

    return NextResponse.json({ scene: updatedScene });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid scene data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Failed to update scene:', error);
    return NextResponse.json(
      { error: 'Failed to update scene' },
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
        { error: 'Invalid scene ID' },
        { status: 400 }
      );
    }

    // Check if the scene exists before attempting to delete
    const scene = await prisma.scene.findUnique({
      where: { id: params.id },
    });

    if (!scene) {
      return NextResponse.json(
        { error: 'Scene not found' },
        { status: 404 }
      );
    }

    await prisma.scene.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Scene deleted successfully' });
  } catch (error) {
    console.error('Failed to delete scene:', error);
    return NextResponse.json(
      { error: 'Failed to delete scene' },
      { status: 500 }
    );
  }
}