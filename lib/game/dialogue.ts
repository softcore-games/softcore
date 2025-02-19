import OpenAI from "openai";
import { Scene } from "./script";
import { prisma } from "@/lib/prisma";

// Cache for character profiles
let characterProfilesCache: Record<string, any> = {};
let lastCacheUpdate = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCharacterProfiles() {
  const now = Date.now();

  if (
    Object.keys(characterProfilesCache).length > 0 &&
    now - lastCacheUpdate < CACHE_TTL
  ) {
    return characterProfilesCache;
  }

  try {
    const characters = await prisma.character.findMany();

    characterProfilesCache = characters.reduce(
      (acc, char) => ({
        ...acc,
        [char.characterId]: {
          name: char.name,
          personality: char.personality,
          background: char.background,
          traits: char.traits,
          emotions: char.emotions,
        },
      }),
      {}
    );

    lastCacheUpdate = now;
    return characterProfilesCache;
  } catch (error) {
    console.error("Failed to fetch character profiles:", error);
    return {};
  }
}

// Fallback responses
const fallbackResponses: Record<string, string> = {
  dialogue:
    "*continues the conversation thoughtfully* That's an interesting perspective.",
  event: "*observes the situation carefully* This could change everything.",
  choice: "The path you choose will shape your journey.",
};

export async function generateDialogue(
  scene: Scene,
  previousChoices: string[] = []
) {
  try {
    if (!scene.requiresAI) return scene.text;

    // Initialize OpenAI only when needed
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const characterProfiles = await getCharacterProfiles();
    const character = characterProfiles[scene.character];

    if (!character) {
      console.error(`Character "${scene.character}" not found`);
      return fallbackResponses[scene.type] || scene.text;
    }

    const prompt = `
      Generate completely random story dialogue that:
      1. Takes unexpected twists and turns
      2. Incorporates ${
        scene.character
      }'s personality but allows creative freedom
      3. Connects loosely to previous choices: ${previousChoices.join(", ")}
      4. Introduces surprising story elements
      5. Maintains engaging narrative flow
      
      Response should include:
      - Character expressions/gestures in *asterisks*
      - Dialogue that advances the random story
      - Open-ended possibilities
      
      Response:
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are generating dialogue for characters in a visual novel game. Keep responses concise and in character.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content?.trim() || scene.text;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return fallbackResponses[scene.type] || scene.text;
  }
}

// Cache implementation
const responseCache = new Map<string, string>();
const MAX_CACHE_SIZE = 1000;

export function getCachedDialogue(
  sceneId: string,
  choices: string[]
): string | undefined {
  const key = `${sceneId}-${choices.join("-")}`;
  return responseCache.get(key);
}

export function cacheDialogue(
  sceneId: string,
  choices: string[],
  response: string
): void {
  const key = `${sceneId}-${choices.join("-")}`;

  // If cache is at max size, remove the oldest entry
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const keys = Array.from(responseCache.keys());
    if (keys.length > 0) {
      responseCache.delete(keys[0]);
    }
  }

  responseCache.set(key, response);
}
