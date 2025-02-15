import OpenAI from 'openai';
import { Scene } from './script';

// Initialize OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

type Emotion = 'happy' | 'curious' | 'excited' | 'thoughtful' | 'teaching' | 'encouraging';

interface EmotionDescriptions {
  happy: string;
  curious: string;
  excited: string;
  thoughtful: string;
  teaching: string;
  encouraging: string;
}

interface Character {
  name: string;
  personality: string;
  background: string;
  teachingStyle: string;
  emotions: EmotionDescriptions;
}

interface CharacterProfiles {
  mei: Character;
}

const characterProfiles: CharacterProfiles = {
  mei: {
    name: 'Mei',
    personality: 'Friendly, patient, and encouraging. She has a knack for explaining complex concepts in simple terms.',
    background: 'A skilled programmer with experience in multiple languages and frameworks. She enjoys teaching and helping others learn.',
    teachingStyle: 'Uses analogies, real-world examples, and interactive challenges to make programming concepts engaging and memorable.',
    emotions: {
      happy: 'Cheerful and welcoming',
      curious: 'Genuinely interested in the student\'s perspective',
      excited: 'Enthusiastic about sharing knowledge',
      thoughtful: 'Carefully considering how to explain concepts',
      teaching: 'Focused and clear in explanation',
      encouraging: 'Supportive and motivating',
    },
  },
};

// Fallback responses when OpenAI is not available
const fallbackResponses: Record<string, string> = {
  'web-dev': "That's great! Web development is an exciting field. Let's start by learning the building blocks: HTML for structure, CSS for styling, and JavaScript for interactivity.",
  'ai-ml': "Excellent choice! AI and machine learning are fascinating fields. We'll begin with Python basics and gradually move into data science concepts.",
  'game-dev': "Amazing! Game development combines creativity with programming. We'll explore game logic, physics, and user interaction to bring your ideas to life.",
  'variable-intro': "Think of variables like labeled boxes where we can store different types of information. Just as you might label a box 'Books' or 'Tools', we label our data in programming!",
  'variable-example': "Let's use a real example: imagine we're making a game score counter. We'd create a variable called 'score' and update it whenever the player succeeds!",
  'variable-alternative': "Here's another way to think about it: variables are like nicknames for data. Instead of saying 'the number of points the player has', we simply say 'score'.",
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

  const emotion = character.emotions[scene.emotion as Emotion];
  if (!emotion) {
    console.error(`Emotion "${scene.emotion}" not found for character "${scene.character}"`);
    return scene.text;
  }
  
  const prompt = `
    Character: ${character.name}
    Current Emotion: ${emotion}
    Personality: ${character.personality}
    Background: ${character.background}
    Teaching Style: ${character.teachingStyle}
    
    Context: ${scene.context}
    Previous Choices: ${previousChoices.join(', ')}
    ${scene.codeChallenge ? `
    Code Challenge:
    ${scene.codeChallenge.code}
    Task: ${scene.codeChallenge.task}
    ` : ''}
    
    Generate a natural, in-character response that:
    1. Reflects the character's current emotion and teaching style
    2. Builds on previous choices to personalize the learning experience
    3. Uses clear explanations with relevant examples
    4. Encourages active participation and learning
    5. Keeps the response concise (2-3 sentences)
    6. If there's a code challenge, provides helpful guidance
    
    Response:
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI generating dialogue for an educational visual novel game. Keep responses concise, engaging, and educational while maintaining character personality.',
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

// Cache implementation with proper TypeScript handling
const responseCache = new Map<string, string>();
const MAX_CACHE_SIZE = 1000;

export function getCachedDialogue(sceneId: string, choices: string[]): string | undefined {
  const key = `${sceneId}-${choices.join('-')}`;
  return responseCache.get(key);
}

export function cacheDialogue(sceneId: string, choices: string[], response: string): void {
  const key = `${sceneId}-${choices.join('-')}`;
  
  // If cache is at max size, remove oldest entry
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const firstKey = Array.from(responseCache.keys())[0];
    if (firstKey) {
      responseCache.delete(firstKey);
    }
  }
  
  responseCache.set(key, response);
}