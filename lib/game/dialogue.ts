import OpenAI from 'openai';
import { Scene } from './script';

// Initialize OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface Character {
  name: string;
  personality: string;
  background: string;
  teachingStyle: string;
}

interface CharacterProfiles {
  mei: Character;
  lily: Character;
}

const characterProfiles: CharacterProfiles = {
  mei: {
    name: 'Mei',
    personality: 'Sophisticated, confident, and elegantly flirtatious while maintaining professionalism. She has a refined sense of humor and carries herself with grace.',
    background: 'An accomplished programmer with expertise in multiple domains. She approaches teaching with elegance and intellectual depth.',
    teachingStyle: 'Uses sophisticated analogies and elegant explanations, often incorporating subtle charm into her teaching.',
  },
  lily: {
    name: 'Lily',
    personality: 'Sweet, cheerful, and endearingly enthusiastic. She has an innocent charm and natural warmth that makes learning fun.',
    background: 'A talented programmer who specializes in making complex concepts accessible through fun and creative explanations.',
    teachingStyle: 'Uses cute analogies and cheerful examples, making learning feel like a joyful adventure.',
  },
};

// Fallback responses when OpenAI is not available
const fallbackResponses: Record<string, string> = {
  'web-dev': "*leans forward with interest* Ah, web development! A sophisticated choice. We'll craft beautiful digital experiences together.",
  'lily-web-response': "*clasps hands together* Ooh, yes! We can make super cute websites! I love how creative we can be with HTML and CSS!",
  'ai-ml': "*raises an eyebrow appreciatively* How intriguing. AI is quite the intellectual pursuit. I find the complexity... fascinating.",
  'lily-ai-response': "*tilts head thoughtfully* It's like teaching computers to think! Though sometimes they think in mysterious ways... *giggles*",
  'game-dev': "*smirks playfully* Games are where logic meets imagination. We'll create worlds together, darling.",
  'lily-game-response': "*bounces excitedly* Yay! I love games! We can make something super fun together! Maybe with cute characters and colorful graphics!",
};

export async function generateDialogue(
  scene: Scene,
  previousChoices: string[] = []
) {
  if (!scene.requiresAI) return scene.text;

  // Use fallback response if OpenAI is not available
  if (!openai || !process.env.OPENAI_API_KEY) {
    return fallbackResponses[scene.id] || scene.text;
  }

  const character = characterProfiles[scene.character as keyof CharacterProfiles];
  if (!character) {
    console.error(`Character "${scene.character}" not found`);
    return scene.text;
  }

  const prompt = `
    Character: ${character.name}
    Personality: ${character.personality}
    Background: ${character.background}
    Teaching Style: ${character.teachingStyle}
    
    Context: ${scene.context}
    Previous Choices: ${previousChoices.join(', ')}
    
    Generate a natural, in-character response that:
    1. Perfectly matches the character's personality and speaking style
    2. Includes appropriate gestures and expressions in *asterisks*
    3. Maintains the character's unique voice and mannerisms
    4. Keeps the response concise (2-3 sentences)
    5. Incorporates teaching concepts in a way that fits the character
    
    Response:
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are generating dialogue for two distinct characters in an educational visual novel. Maintain their unique personalities and teaching styles.',
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
    return fallbackResponses[scene.id] || scene.text;
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
    const firstKey = Array.from(responseCache.keys())[0];
    if (firstKey) {
      responseCache.delete(firstKey);
    }
  }
  
  responseCache.set(key, response);
}