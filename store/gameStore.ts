import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Character {
  id: string;
  name: string;
  relationship: number;
}

interface GameState {
  currentScene: string;
  characters: Record<string, Character>;
  choices: string[];
  settings: {
    volume: number;
    textSpeed: 'slow' | 'normal' | 'fast';
    autoplay: boolean;
  };
  progress: {
    chapter: number;
    scene: number;
    completed: string[];
  };
}

interface GameStore extends GameState {
  updateScene: (scene: string) => void;
  updateRelationship: (characterId: string, amount: number) => void;
  addChoice: (choice: string) => void;
  updateSettings: (settings: Partial<GameState['settings']>) => void;
  updateProgress: (progress: Partial<GameState['progress']>) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      currentScene: 'intro',
      characters: {},
      choices: [],
      settings: {
        volume: 100,
        textSpeed: 'normal',
        autoplay: false,
      },
      progress: {
        chapter: 1,
        scene: 1,
        completed: [],
      },
      updateScene: (scene) => set({ currentScene: scene }),
      updateRelationship: (characterId, amount) =>
        set((state) => ({
          characters: {
            ...state.characters,
            [characterId]: {
              ...state.characters[characterId],
              relationship: state.characters[characterId].relationship + amount,
            },
          },
        })),
      addChoice: (choice) =>
        set((state) => ({
          choices: [...state.choices, choice],
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      updateProgress: (newProgress) =>
        set((state) => ({
          progress: { ...state.progress, ...newProgress },
        })),
    }),
    {
      name: 'game-storage',
    }
  )
);