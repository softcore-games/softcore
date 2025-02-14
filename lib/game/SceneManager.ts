'use client';

import { Scene, Choice, GameState } from '@/lib/types';
import { prisma } from '@/lib/prisma';

export class SceneManager {
  private scenes: Map<string, Scene>;

  constructor() {
    this.scenes = new Map();
  }

  loadScene(scene: Scene) {
    if (!scene.id || !scene.dialogue) {
      throw new Error('Invalid scene data: missing required fields');
    }
    this.scenes.set(scene.id, scene);
  }

  loadScenes(scenes: Scene[]) {
    scenes.forEach((scene) => this.loadScene(scene));
  }

  getScene(sceneId: string): Scene | undefined {
    return this.scenes.get(sceneId);
  }

  getAllScenes(): Scene[] {
    return Array.from(this.scenes.values());
  }

  async processChoice(choice: Choice, gameState: GameState): Promise<string> {
    if (!choice.nextScene || !this.scenes.has(choice.nextScene)) {
      throw new Error(`Invalid next scene: ${choice.nextScene}`);
    }

    // Validate requirements
    if (choice.requiresTokens && !gameState.isPremium) {
      throw new Error('Premium tokens required for this choice');
    }

    if (choice.requiresNft && !gameState.nfts.includes(choice.requiresNft)) {
      throw new Error('Required NFT not owned');
    }

    try {
      // Update relationships
      if (choice.relationshipEffect) {
        const updatedRelationships = { ...gameState.relationships };
        Object.entries(choice.relationshipEffect).forEach(([characterId, value]) => {
          updatedRelationships[characterId] = (updatedRelationships[characterId] || 0) + value;
        });

        // Save progress to database
        await prisma.gameProgress.upsert({
          where: { userId: gameState.userId },
          update: {
            relationships: updatedRelationships,
            choices: {
              push: {
                sceneId: gameState.currentScene,
                choiceText: choice.text,
                timestamp: new Date(),
              },
            },
            currentScene: choice.nextScene,
          },
          create: {
            userId: gameState.userId,
            currentScene: choice.nextScene,
            relationships: updatedRelationships,
            inventory: gameState.inventory,
            choices: [
              {
                sceneId: gameState.currentScene,
                choiceText: choice.text,
                timestamp: new Date(),
              },
            ],
            nfts: gameState.nfts,
            isPremium: gameState.isPremium,
          },
        });
      }

      return choice.nextScene;
    } catch (error) {
      console.error('Error processing choice:', error);
      throw new Error('Failed to process choice');
    }
  }

  validateScene(scene: Scene): boolean {
    return !!(
      scene.id &&
      scene.dialogue &&
      Array.isArray(scene.choices) &&
      scene.choices.every(
        (choice) => choice.text && choice.nextScene && this.scenes.has(choice.nextScene)
      )
    );
  }
}
