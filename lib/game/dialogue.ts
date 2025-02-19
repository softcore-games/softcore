import OpenAI from "openai";
import {
  Scene,
  CharacterProfile,
  CacheConfig,
  CACHE_CONFIG,
  FALLBACK_RESPONSES,
  SceneImages,
} from "@/lib/types/game";
import { prisma } from "@/lib/prisma";

// OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache implementations
class Cache<T> {
  private cache: Map<string, T>;
  private lastUpdate: number;
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.cache = new Map();
    this.lastUpdate = 0;
    this.config = config;
  }

  get(key: string): T | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.config.MAX_SIZE) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
    this.lastUpdate = Date.now();
  }

  isValid(): boolean {
    return (
      this.cache.size > 0 && Date.now() - this.lastUpdate < this.config.TTL
    );
  }

  clear(): void {
    this.cache.clear();
    this.lastUpdate = 0;
  }
}

// Cache instances
const characterCache = new Cache<Record<string, CharacterProfile>>(
  CACHE_CONFIG
);
const dialogueCache = new Cache<string>(CACHE_CONFIG);

// Character profile management
async function getCharacterProfiles(): Promise<
  Record<string, CharacterProfile>
> {
  if (characterCache.isValid()) {
    return characterCache.get("profiles") || {};
  }

  try {
    const characters = await prisma.character.findMany();
    const profiles = characters.reduce(
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

    characterCache.set("profiles", profiles);
    return profiles;
  } catch (error) {
    console.error("Failed to fetch character profiles:", error);
    return {};
  }
}

// Dialogue generation
export async function generateResponse(
  character: string,
  context: string,
  playerChoice?: string
): Promise<string> {
  const cacheKey = `${character}-${context}-${playerChoice || ""}`;
  const cachedResponse = dialogueCache.get(cacheKey);
  if (cachedResponse) return cachedResponse;

  const profiles = await getCharacterProfiles();
  const profile = profiles[character.toLowerCase()];

  if (!profile) {
    console.error(`Character "${character}" not found`);
    return FALLBACK_RESPONSES.dialogue;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI generating dialogue for characters in a visual novel game. Keep responses concise and in character.",
        },
        {
          role: "user",
          content: generatePrompt(profile, context, playerChoice),
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const generatedResponse =
      response.choices[0].message.content?.trim() ||
      FALLBACK_RESPONSES.dialogue;
    dialogueCache.set(cacheKey, generatedResponse);
    return generatedResponse;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return FALLBACK_RESPONSES.dialogue;
  }
}

// Image generation
export async function generateSceneImages(scene: Scene): Promise<SceneImages> {
  try {
    const [backgroundImage, characterImage] = await Promise.all([
      generateBackgroundImage(scene.background),
      generateCharacterImage(scene.emotion),
    ]);

    return {
      characterImage: characterImage?.data[0]?.url || null,
      backgroundImage: backgroundImage?.data[0]?.url || null,
    };
  } catch (error) {
    console.error("Failed to generate images:", error);
    return { characterImage: null, backgroundImage: null };
  }
}

// Helper functions
function generatePrompt(
  profile: CharacterProfile,
  context: string,
  playerChoice?: string
): string {
  return `
    Character: ${profile.name}
    Personality: ${profile.personality}
    Background: ${profile.background}
    Traits: ${profile.traits.join(", ")}
    Context: ${context}
    ${playerChoice ? `Player's choice: ${playerChoice}` : ""}
    
    Generate a natural, in-character response that:
    1. Reflects the character's personality and background
    2. Responds appropriately to the context and player's choice
    3. Includes appropriate gestures and expressions in *asterisks*
    4. Maintains the character's unique voice and mannerisms
    5. Keeps responses concise (2-3 sentences)
  `;
}

async function generateBackgroundImage(background: string | null) {
  return !background
    ? openai.images.generate({
        model: "dall-e-3",
        prompt: `Detailed ${
          background || "classroom"
        } setting. High quality anime background art, visual novel style, cinematic wide view, no characters, highly detailed environment, professional lighting, 16:9 aspect ratio.`,
        n: 1,
        size: "1792x1024",
        quality: "hd",
        style: "vivid",
      })
    : null;
}

async function generateCharacterImage(emotion: string) {
  return openai.images.generate({
    model: "dall-e-3",
    prompt: `Full body portrait of an anime character girl showing ${emotion} emotion. Visual novel style, high quality, transparent background, centered composition, detailed facial features and clothing, professional lighting.`,
    n: 1,
    size: "1024x1024",
    quality: "standard",
    style: "natural",
  });
}
