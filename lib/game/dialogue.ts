import OpenAI from 'openai';
import { Scene } from './script';
import { prisma } from '@/lib/prisma';

// Initialize OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Cache for character profiles
let characterProfilesCache: Record<string, any> = {};
let lastCacheUpdate = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCharacterProfiles() {
  const now = Date.now();
  
  if (Object.keys(characterProfilesCache).length > 0 && now - lastCacheUpdate < CACHE_TTL) {
    return characterProfilesCache;
  }

  try {
    const characters = await prisma.character.findMany();
    
    characterProfilesCache = characters.reduce((acc, char) => ({
      ...acc,
      [char.characterId]: {
        name: char.name,
        personality: char.personality,
        background: char.background,
        traits: char.traits,
        emotions: char.emotions,
      },
    }), {});

    lastCacheUpdate = now;
    return characterProfilesCache;
  } catch (error) {
    console.error('Failed to fetch character profiles:', error);
    return {};
  }
}

// Fallback responses
const fallbackResponses: Record<string, string> = {
  dialogue: '*continues the conversation thoughtfully* That\'s an interesting perspective.',
  event: '*observes the situation carefully* This could change everything.',
  choice: 'The path you choose will shape your journey.',
};

export async function generateDialogue(
  scene: Scene,
  previousChoices: string[] = []
) {
  if (!scene.requiresAI) return scene.text;

  if (!openai || !process.env.OPENAI_API_KEY) {
    return fallbackResponses[scene.type] || scene.text;
  }

  const characterProfiles = await getCharacterProfiles();
  const character = characterProfiles[scene.character];
  
  if (!character) {
    console.error(`Character "${scene.character}" not found`);
    return scene.text;
  }

  const prompt = `
    Character: ${character.name}
    Personality: ${character.personality}
    Background: ${character.background}
    Traits: ${character.traits.join(', ')}
    Current Emotion: ${character.emotions[scene.emotion] || scene.emotion}
    Scene Type: ${scene.type}
    
    Context: ${scene.context || ''}
    Previous Choices: ${previousChoices.join(', ')}
    
    Generate a natural, in-character response that:
    1. Reflects the character's personality and background
    2. Responds appropriately to the context and player's choices
    3. Includes appropriate gestures and expressions in *asterisks*
    4. Maintains the character's unique voice and mannerisms
    5. Keeps responses concise (2-3 sentences)
    
    Response:
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are generating dialogue for characters in a visual novel game. Keep responses concise and in character.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content?.trim() || scene.text;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return fallbackResponses[scene.type] || scene.text;
  }
}

// Cache implementation
const responseCache = new Map<string, string>();
const MAX_CACHE_SIZE = 1000;

export function getCachedDialogue(sceneId: string, choices: string[]): string | undefined {
  const key = `${sceneId}-${choices.join('-')}`;
  return responseCache.get(key);
}

export function cacheDialogue(sceneId: string, choices: string[], response: string): void {
  const key = `${sceneId}-${choices.join('-')}`;
  
  // If cache is at max size, remove the oldest entry
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const keys = Array.from(responseCache.keys());
    if (keys.length > 0) {
      responseCache.delete(keys[0]);
    }
  }
  
  responseCache.set(key, response);
}