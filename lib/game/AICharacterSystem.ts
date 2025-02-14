"use client";

import OpenAI from 'openai';
import { Character } from '@/lib/types';
import { prisma } from '@/lib/prisma';

export class AICharacterSystem {
  private openai: OpenAI;
  private characters: Map<string, Character>;
  
  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
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
      relationshipValue: number,
      previousChoices: string[],
      currentScene: string
    }
  ): Promise<string> {
    const character = this.characters.get(characterId);
    if (!character) {
      throw new Error(`Character not found: ${characterId}`);
    }

    try {
      const prompt = this.buildPrompt(character, playerInput, context);
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: this.buildSystemPrompt(character)
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      return response.choices[0].message.content || 'I\'m not sure how to respond to that.';
    } catch (error) {
      console.error('AI response generation failed:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  private buildSystemPrompt(character: Character): string {
    return `You are ${character.name}, a character in an interactive visual novel.
${character.description}

Maintain character consistency and remember:
1. Stay in character at all times
2. Reference past interactions when relevant
3. Show appropriate emotional responses
4. Keep responses concise but meaningful
5. Adapt tone based on relationship level`;
  }

  private buildPrompt(character: Character, playerInput: string, context: any): string {
    return `Current context:
- Relationship level: ${context.relationshipValue} (Scale: -10 to 10)
- Current scene: ${context.currentScene}
- Recent choices: ${context.previousChoices.slice(-3).join(', ')}

Player says: "${playerInput}"

Respond naturally as ${character.name}, considering:
1. Your current relationship with the player
2. The scene context
3. Recent player choices
4. Your character's personality`;
  }
}