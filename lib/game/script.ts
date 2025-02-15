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
    const response = await fetch('/api/game/scenes', {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch scenes');
    }

    const data = await response.json();
    return data.scenes;
  } catch (error) {
    console.error('Failed to fetch scenes:', error);
    return [];
  }
}