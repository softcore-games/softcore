import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const SceneType = z.object({
  id: z.string(),
  sceneId: z.string(),
  character: z.string(),
  emotion: z.string(),
  text: z.string(),
  next: z.string().nullable(),
  choices: z.array(z.object({
    text: z.string(),
    next: z.string(),
  })).nullable(),
  context: z.string().nullable(),
  requiresAI: z.boolean(),
  background: z.string().nullable(),
  type: z.string(),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Scene = z.infer<typeof SceneType>;

export async function getGameScript(): Promise<Scene[]> {
  try {
    const scenes = await prisma.scene.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return scenes;
  } catch (error) {
    console.error('Failed to fetch scenes:', error);
    return [];
  }
}

// Sample scenes for testing
export const initialScenes: Scene[] = [
  {
    id: '1',
    sceneId: 'intro',
    character: 'mei',
    emotion: 'happy',
    text: '*adjusts her glasses with a warm smile* Welcome to our story! I\'m Mei, and I\'m excited to get to know you.',
    next: 'cafe-scene',
    choices: null,
    context: null,
    requiresAI: false,
    background: 'classroom',
    type: 'dialogue',
    metadata: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    sceneId: 'cafe-scene',
    character: 'mei',
    emotion: 'curious',
    text: '*stirring her coffee thoughtfully* So, what brings you here today?',
    next: null,
    choices: [
      {
        text: 'I\'m looking for a fresh start',
        next: 'fresh-start',
      },
      {
        text: 'I heard this place has great stories',
        next: 'story-lover',
      },
      {
        text: 'I\'m following my dreams',
        next: 'dreamer',
      },
    ],
    context: null,
    requiresAI: false,
    background: 'cafe',
    type: 'choice',
    metadata: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];