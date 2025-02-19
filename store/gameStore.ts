import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Scene } from "@/lib/types/game";

interface Character {
  id: string;
  name: string;
  relationship: number;
}

interface GameState {
  scenes: Scene[];
  currentScene: Scene | null;
  isLoading: boolean;
  isProcessingChoice: boolean;
  displayText: string;
  isDialogueComplete: boolean;
  choices: string[];
  characters: Record<string, Character>;
  settings: {
    volume: number;
    textSpeed: "slow" | "normal" | "fast";
    autoplay: boolean;
  };
  progress: {
    chapter: number;
    scene: number;
    completed: string[];
  };

  // Actions
  setScene: (scene: Scene) => void;
  setLoading: (loading: boolean) => void;
  setProcessingChoice: (processing: boolean) => void;
  setDisplayText: (text: string) => void;
  setDialogueComplete: (complete: boolean) => void;
  addChoice: (choice: string) => void;
  updateRelationship: (characterId: string, amount: number) => void;
  updateSettings: (settings: Partial<GameState["settings"]>) => void;
  updateProgress: (progress: Partial<GameState["progress"]>) => void;

  // Thunks
  fetchScene: (
    previousScene?: Scene | null,
    playerChoice?: { text: string; next: string }
  ) => Promise<void>;
}

interface GameStore extends GameState {
  updateScene: (scene: string) => void;
  updateRelationship: (characterId: string, amount: number) => void;
  addChoice: (choice: string) => void;
  updateSettings: (settings: Partial<GameState["settings"]>) => void;
  updateProgress: (progress: Partial<GameState["progress"]>) => void;
}

const FALLBACK_SCENE: Scene = {
  id: "fallback",
  sceneId: "fallback",
  character: "mei",
  emotion: "neutral",
  text: "I apologize, but we seem to be having some technical difficulties. Let's try something else...",
  next: null,
  choices: [
    {
      text: "Try again",
      next: "retry",
    },
    {
      text: "Start a new conversation",
      next: "new",
    },
  ],
  context: null,
  requiresAI: false,
  background: "classroom",
  characterImage: "/characters/mei/neutral.png",
  backgroundImage: "/backgrounds/classroom.jpg",
  type: "dialogue",
  metadata: { fallback: true },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      scenes: [],
      currentScene: null,
      isLoading: true,
      isProcessingChoice: false,
      displayText: "",
      isDialogueComplete: false,
      choices: [],
      characters: {},
      settings: {
        volume: 100,
        textSpeed: "normal",
        autoplay: false,
      },
      progress: {
        chapter: 1,
        scene: 1,
        completed: [],
      },

      setScene: (scene) =>
        set((state) => ({
          scenes: [...state.scenes, scene],
          currentScene: scene,
          displayText: scene.text,
          isDialogueComplete: false,
        })),

      setLoading: (loading) => set({ isLoading: loading }),
      setProcessingChoice: (processing) =>
        set({ isProcessingChoice: processing }),
      setDisplayText: (text) => set({ displayText: text }),
      setDialogueComplete: (complete) => set({ isDialogueComplete: complete }),
      addChoice: (choice) =>
        set((state) => ({ choices: [...state.choices, choice] })),

      fetchScene: async (previousScene, playerChoice) => {
        const state = get();
        if (state.isProcessingChoice) return;

        try {
          set({ isLoading: true, isProcessingChoice: true });
          console.log("Fetching scene...", { previousScene, playerChoice });

          if (previousScene?.metadata?.fallback) {
            if (playerChoice?.next === "retry") {
              const lastValidScene = state.scenes.findLast(
                (s) => !s.metadata?.fallback
              );
              return await get().fetchScene(lastValidScene || null);
            }
            if (playerChoice?.next === "new") {
              set({ scenes: [] });
              return await get().fetchScene();
            }
          }

          const response = await fetch("/api/game/scene", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              previousScene,
              playerChoice: playerChoice?.next,
            }),
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch scene: ${response.status}`);
          }

          const data = await response.json();
          console.log("Received scene data:", data);

          if (data.scene) {
            get().setScene(data.scene);
          } else {
            throw new Error("No scene data received");
          }
        } catch (error) {
          console.error("Failed to fetch scene:", error);
          get().setScene(FALLBACK_SCENE);
          set({ isLoading: false, isProcessingChoice: false });
        }
      },

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
      name: "game-storage",
      skipHydration: true,
    }
  )
);
