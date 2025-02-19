import { z } from "zod";
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";

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
  characterImage: z.string().nullable(),
  backgroundImage: z.string().nullable(),
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

    // Get available characters and assets from database
    const [characters, backgrounds] = await Promise.all([
      prisma.character.findMany(),
      prisma.asset.findMany({
        where: { type: "background" },
      }),
    ]);

    // Handle case when no characters or backgrounds exist
    if (!characters || characters.length === 0) {
      throw new Error("No characters found in database");
    }

    const prompt = `
      Generate a dynamic visual novel scene that advances the story. Consider:
      - Previous context: ${previousContext}
      ${playerChoice ? `- Player's last choice: ${playerChoice}` : ""}

      Available characters: ${characters
        .map((c) => `${c.name} (${c.personality})`)
        .join(", ")}

      Available backgrounds: ${backgrounds.map((b) => b.name).join(", ")}

      Generate a scene that includes:
      1. The most appropriate character for this moment
      2. Their emotional state and expression
      3. A fitting background location
      4. Natural dialogue (1-2 sentences)
      5. 2-3 meaningful choices for the player
      6. Story progression that feels natural but unexpected

      Return as JSON with:
      {
        "character": "character_name",
        "emotion": "character_emotion",
        "background": "scene_location",
        "dialogue": "character_dialogue",
        "choices": ["choice1", "choice2", "choice3"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are generating dynamic scenes for an interactive visual novel. Create engaging, contextual responses that maintain story coherence.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const sceneData = JSON.parse(response.choices[0].message.content || "{}");

    // Find the matching character from our database
    const selectedCharacter =
      characters.find(
        (c) => c.name.toLowerCase() === sceneData.character?.toLowerCase()
      ) || characters[Math.floor(Math.random() * characters.length)];

    // Find the matching background or use a default
    const selectedBackground =
      backgrounds.find(
        (b) => b.name.toLowerCase() === sceneData.background?.toLowerCase()
      )?.name || "classroom";

    // Generate scene first
    const scene = {
      id: new ObjectId().toString(),
      sceneId: new ObjectId().toString(),
      character: selectedCharacter.characterId,
      emotion: sceneData.emotion || "neutral",
      text: sceneData.dialogue || "Let's see what happens next!",
      next: null,
      choices:
        sceneData.choices?.map((choice: string) => ({
          text: choice,
          next: new ObjectId().toString(),
        })) || null,
      context: previousContext,
      requiresAI: true,
      background: selectedBackground,
      characterImage: null,
      backgroundImage: null,
      type: "dialogue",
      metadata: {
        aiGenerated: true,
        timestamp: new Date().toISOString(),
        previousChoice: playerChoice || null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save the scene to database
    const savedScene = await prisma.scene.create({
      data: scene,
    });

    return scene;
  } catch (error) {
    console.error("Failed to generate scene:", error);
    // Return a fallback scene
    return {
      id: new ObjectId().toString(),
      sceneId: new ObjectId().toString(),
      character: "mei",
      emotion: "neutral",
      text: "Something unexpected happened. Let's try a different path...",
      next: null,
      choices: [
        {
          text: "Continue the adventure",
          next: new ObjectId().toString(),
        },
        {
          text: "Start a new story",
          next: new ObjectId().toString(),
        },
      ],
      context: null,
      requiresAI: false,
      background: "classroom",
      characterImage: null,
      backgroundImage: null,
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
