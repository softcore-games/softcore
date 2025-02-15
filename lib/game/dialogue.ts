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

// Fallback responses for different scene types
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
    1. Perfectly matches the character's personality and traits
    2. Includes appropriate gestures and expressions in *asterisks*
    3. Maintains the character's unique voice and mannerisms
    4. Fits the scene type (${scene.type})
    5. Keeps the response concise (2-3 sentences)
    
    Response:
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are generating dialogue for characters in a visual novel. Each character has unique traits and mannerisms that should be reflected in their responses.',
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
  
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
  
  responseCache.set(key, response);
}