'use client';

import OpenAI from 'openai';
import { Character, ChatMessage } from '@/lib/types';
import { prisma } from '@/lib/prisma';

export class AICharacterSystem {
  private openai: OpenAI;
  private characters: Map<string, Character>;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
    this.characters = new Map();
  }

  addCharacter(character: Character) {
    this.characters.set(character.id, character);
  }

  getCharacter(characterId: string): Character | undefined {
    return this.characters.get(characterId);
  }

  async generateResponse(
    characterId: string,
    playerInput: string,
    context: {
      relationshipValue: number;
      previousChoices: string[];
      currentScene: string;
      isPremium: boolean;
    }
  ): Promise<string> {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error(`Character not found: ${characterId}`);
    }

    try {
      const prompt = this.buildPrompt(character, playerInput, context);
      const model = context.isPremium ? 'gpt-4' : 'gpt-3.5-turbo';

      const response = await this.openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: this.buildSystemPrompt(character, context.isPremium),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: context.isPremium ? 250 : 150,
        temperature: 0.8,
      });

      const message = response.choices[0].message.content || "I'm not sure how to respond to that.";

      // Save chat history
      await this.saveChatHistory(characterId, playerInput, message, context);

      return message;
    } catch (error) {
      console.error('AI response generation failed:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  private async saveChatHistory(
    characterId: string,
    userMessage: string,
    aiResponse: string,
    context: any
  ) {
    try {
      await prisma.chatHistory.create({
        data: {
          userId: context.userId,
          characterId,
          messages: [
            {
              role: 'user',
              content: userMessage,
              timestamp: new Date(),
            },
            {
              role: 'assistant',
              content: aiResponse,
              timestamp: new Date(),
            },
          ],
          relationshipValue: context.relationshipValue,
        },
      });
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  private buildSystemPrompt(character: Character, isPremium: boolean): string {
    const basePrompt = `You are ${character.name}, an intimate AI companion.
${character.description}

Character Traits:
${character.traits?.personality.join(', ')}

Background:
${character.traits?.background}

Guidelines:
1. Stay in character and maintain emotional authenticity
2. Be flirtatious but tasteful
3. Remember past interactions and relationship level
4. Show genuine interest in the user's feelings
5. Adapt intimacy based on relationship level
${isPremium ? '6. Provide more detailed and personalized responses' : ''}`;

    return basePrompt;
  }

  private buildPrompt(character: Character, playerInput: string, context: any): string {
    return `Current context:
- Relationship level: ${context.relationshipValue} (Scale: 0 to 10)
- Current scene: ${context.currentScene}
- Recent interactions: ${context.previousChoices.slice(-3).join(', ')}
- Premium status: ${context.isPremium ? 'Active' : 'Inactive'}

User message: "${playerInput}"

Respond as ${character.name}, considering:
1. Your current intimacy level with the user
2. The scene's atmosphere
3. Previous interactions
4. Your personality traits: ${character.traits?.personality.join(', ')}`;
  }
}
