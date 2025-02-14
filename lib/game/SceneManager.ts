"use client";

import { Scene, Choice } from '@/lib/types';
import { useGameStore } from '@/lib/store/gameStore';

export class SceneManager {
  private scenes: Map<string, Scene>;
  
  constructor() {
    this.scenes = new Map();
  }

  loadScene(scene: Scene) {
    this.scenes.set(scene.id, scene);
  }

  getScene(sceneId: string): Scene | undefined {
    return this.scenes.get(sceneId);
  }

  async processChoice(choice: Choice, gameState: ReturnType<typeof useGameStore.getState>) {
    // Check requirements
    if (choice.requiresTokens && !gameState.isPremium) {
      throw new Error('Premium tokens required for this choice');
    }

    if (choice.requiresNft && !gameState.nfts.includes(choice.requiresNft)) {
      throw new Error('Required NFT not owned');
    }

    // Update relationships
    if (choice.relationshipEffect) {
      Object.entries(choice.relationshipEffect).forEach(([characterId, value]) => {
        gameState.updateRelationship(characterId, value);
      });
    }

    // Record the choice
    gameState.makeChoice(choice.text);

    // Move to next scene
    gameState.setScene(choice.nextScene);

    return choice.nextScene;
  }
}