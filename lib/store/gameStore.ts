"use client";

import { create } from 'zustand';
import { Scene, Character, GameState } from '@/lib/types';

interface GameStore extends GameState {
  setScene: (sceneId: string) => void;
  addToInventory: (item: string) => void;
  updateRelationship: (characterId: string, value: number) => void;
  makeChoice: (choice: string) => void;
  addNft: (nftId: string) => void;
  setPremiumStatus: (status: boolean) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  currentScene: 'intro',
  inventory: [],
  relationships: {},
  choices: [],
  nfts: [],
  isPremium: false,

  setScene: (sceneId) => 
    set({ currentScene: sceneId }),

  addToInventory: (item) =>
    set((state) => ({ 
      inventory: [...state.inventory, item] 
    })),

  updateRelationship: (characterId, value) =>
    set((state) => ({
      relationships: {
        ...state.relationships,
        [characterId]: (state.relationships[characterId] || 0) + value
      }
    })),

  makeChoice: (choice) =>
    set((state) => ({
      choices: [...state.choices, choice]
    })),

  addNft: (nftId) =>
    set((state) => ({
      nfts: [...state.nfts, nftId]
    })),

  setPremiumStatus: (status) =>
    set({ isPremium: status })
}));