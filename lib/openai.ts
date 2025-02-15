import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export async function generateResponse(
  character: string,
  context: string,
  playerChoice?: string
) {
  const characterProfiles = await getCharacterProfiles();
  const profile = characterProfiles[character.toLowerCase()];
  
  if (!profile) {
    console.error(`Character "${character}" not found`);
    return null;
  }

  const prompt = `
    Character: ${profile.name}
    Personality: ${profile.personality}
    Background: ${profile.background}
    Traits: ${profile.traits.join(', ')}
    Context: ${context}
    ${playerChoice ? `Player's choice: ${playerChoice}` : ''}
    
    Generate a natural, in-character response that:
    1. Reflects the character's personality and background
    2. Responds appropriately to the context and player's choice
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
          content: 'You are an AI generating dialogue for characters in a visual novel game. Keep responses concise and in character.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content?.trim() || null;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return null;
  }
}

// Cache for storing generated responses
const responseCache = new Map<string, string>();
const MAX_CACHE_SIZE = 1000;

export function getCachedResponse(key: string) {
  return responseCache.get(key);
}

export function cacheResponse(key: string, response: string) {
  // If cache is at max size, remove the oldest entry
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const keys = Array.from(responseCache.keys());
    if (keys.length > 0) {
      responseCache.delete(keys[0]);
    }
  }
  
  responseCache.set(key, response);
}