import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Character {
  name: string;
  personality: string;
  background: string;
}

const characterProfiles: Record<string, Character> = {
  mei: {
    name: 'Mei',
    personality: 'Cheerful, intelligent, and supportive. She has a passion for computer science and enjoys helping others learn.',
    background: 'A second-year computer science student who excels in her studies while maintaining a friendly and approachable demeanor.',
  },
  // Add more characters as needed
};

export async function generateResponse(
  character: string,
  context: string,
  playerChoice?: string
) {
  const profile = characterProfiles[character.toLowerCase()];
  if (!profile) throw new Error('Character not found');

  const prompt = `
    Character: ${profile.name}
    Personality: ${profile.personality}
    Background: ${profile.background}
    Context: ${context}
    ${playerChoice ? `Player's choice: ${playerChoice}` : ''}
    
    Generate a natural, in-character response that:
    1. Reflects the character's personality and background
    2. Responds appropriately to the context and player's choice
    3. Maintains a friendly and engaging tone
    4. Keeps responses concise (max 2-3 sentences)
    
    Response:
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI generating natural dialogue for a visual novel game. Keep responses concise and in character.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0].message.content?.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'I\'m not sure how to respond to that right now.';
  }
}

// Cache for storing generated responses
const responseCache = new Map<string, string>();

export function getCachedResponse(key: string) {
  return responseCache.get(key);
}

export function cacheResponse(key: string, response: string) {
  responseCache.set(key, response);
  // Limit cache size to prevent memory issues
  if (responseCache.size > 1000) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
}