import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const sceneSchema = z.object({
  sceneId: z.string(),
  character: z.string(),
  emotion: z.string(),
  text: z.string(),
  next: z.string().optional().nullable(),
  choices: z.array(z.object({
    text: z.string(),
    next: z.string(),
  })).optional().nullable(),
  context: z.string().optional().nullable(),
  requiresAI: z.boolean().default(false),
  background: z.string().optional().nullable(),
  type: z.string().default('dialogue'),
  metadata: z.record(z.any()).optional().nullable(),
});

const importSchema = z.array(sceneSchema);

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
    // Extract the scenes array from the wrapper object if it exists
    const scenesData = Array.isArray(body) ? body : body.scenes;
    
    if (!scenesData) {
      return NextResponse.json(
        { error: 'No scenes data provided' },
        { status: 400 }
      );
    }

    const scenes = importSchema.parse(scenesData);

    await prisma.$transaction(async (tx) => {
      // Clear existing scenes
      await tx.scene.deleteMany();

      // Import new scenes
      for (const scene of scenes) {
        await tx.scene.create({
          data: {
            ...scene,
            choices: scene.choices || undefined,
            metadata: scene.metadata || undefined,
          },
        });
      }
    });

    return NextResponse.json({ message: 'Scenes imported successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid scene data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Failed to import scenes:', error);
    return NextResponse.json(
      { error: 'Failed to import scenes' },
      { status: 500 }
    );
  }
}