"use client";

import OpenAI from 'openai';
import { Character } from '@/lib/types';

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

  async generateResponse(
    characterId: string, 
    playerInput: string, 
    context: { 
      relationshipValue: number,
      previousChoices: string[],
      currentScene: string
    }
  ) {
    const character = this.characters.get(characterId);
    if (!character) throw new Error('Character not found');

    const prompt = this.buildPrompt(character, playerInput, context);

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: `You are ${character.name}. ${character.description}`
        }, {
          role: "user",
          content: prompt
        }],
        max_tokens: 150,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI response generation failed:', error);
      return 'I\'m not sure how to respond to that right now.';
    }
  }

  private buildPrompt(character: Character, playerInput: string, context: any): string {
    return `
      Current relationship level: ${context.relationshipValue}
      Current scene: ${context.currentScene}
      Previous choices: ${context.previousChoices.join(', ')}
      
      Player says: ${playerInput}
      
      Respond as ${character.name}, considering the relationship level and previous interactions.
    `;
  }
}