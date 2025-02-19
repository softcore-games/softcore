import { z } from "zod";
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const SceneType = z.object({
  id: z.string(),
  sceneId: z.string(),
  character: z.string(),
  emotion: z.string(),
  text: z.string(),
  next: z.string().nullable(),
  choices: z
    .array(
      z.object({
        text: z.string(),
        next: z.string(),
      })
    )
    .nullable(),
  context: z.string().nullable(),
  requiresAI: z.boolean(),
  background: z.string().nullable(),
  type: z.string(),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Scene = z.infer<typeof SceneType>;

export async function generateScene(
  previousScene?: Scene | null,
  playerChoice?: string
): Promise<Scene> {
  try {
    // Initialize OpenAI only when needed
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const previousContext = previousScene?.text || "Starting new conversation";

    // Get available characters from database
    const characters = await prisma.character.findMany();

    // Handle case when no characters exist
    if (!characters || characters.length === 0) {
      throw new Error("No characters found in database");
    }

    const randomCharacter =
      characters[Math.floor(Math.random() * characters.length)];

    const prompt = `
      Generate a random visual novel scene with:
      - Random character (from available: ${characters
        .map((c) => c.name)
        .join(", ")})
      - Random appropriate background setting
      - Random emotion matching the character's personality
      - Context: ${previousContext}
      ${playerChoice ? `Player chose: ${playerChoice}` : ""}

      Generate:
      1. Natural dialogue (1-2 sentences)
      2. 2-3 choices for the player (if applicable)
      3. Appropriate emotion and background based on character
      4. Completely random story progression
      
      Return as JSON with: character, emotion, background, dialogue, choices
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-json-mode",
      messages: [
        {
          role: "system",
          content:
            "You are generating scenes for a programming education visual novel. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const sceneData = JSON.parse(response.choices[0].message.content || "{}");

    return {
      id: Math.random().toString(36).substring(7),
      sceneId: Math.random().toString(36).substring(7),
      character: sceneData.character || randomCharacter.characterId,
      emotion: sceneData.emotion || "neutral",
      text: sceneData.dialogue || "Let's see what happens next!",
      next: null,
      choices:
        sceneData.choices?.map((choice: string) => ({
          text: choice,
          next: Math.random().toString(36).substring(7),
        })) || null,
      context: sceneData.context || null,
      requiresAI: true,
      background: sceneData.background || "mystery_zone",
      type: "dialogue",
      metadata: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Failed to generate scene:", error);
    // Return a more detailed fallback scene
    return {
      id: Math.random().toString(36).substring(7),
      sceneId: Math.random().toString(36).substring(7),
      character: "mei",
      emotion: "neutral",
      text: "Something unexpected happened. Let's try a different path...",
      next: null,
      choices: [
        {
          text: "Continue the adventure",
          next: Math.random().toString(36).substring(7),
        },
        {
          text: "Start a new story",
          next: Math.random().toString(36).substring(7),
        },
      ],
      context: null,
      requiresAI: false,
      background: "classroom",
      type: "dialogue",
      metadata: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export async function getGameScript(): Promise<Scene[]> {
  // Instead of fetching from API, generate initial scene
  const initialScene = await generateScene();
  return [initialScene];
}
