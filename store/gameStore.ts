import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Scene, SubscriptionType } from "@/lib/types/game";

interface Character {
  id: string;
  name: string;
  relationship: number;
}

interface StaminaInfo {
  current: number;
  max: number | "UNLIMITED";
  subscription: SubscriptionType;
  lastReset?: string;
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
  stamina: StaminaInfo;

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
  setStamina: (staminaInfo: Partial<StaminaInfo>) => void;

  // Thunks
  fetchScene: (
    previousScene?: Scene | null,
    playerChoice?: { text: string; next: string }
  ) => Promise<void>;
  fetchStamina: () => Promise<void>;
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
  characterImage: "/characters/mei/curious.png",
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
      stamina: {
        current: 0,
        max: 0,
        subscription: "FREE",
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

      setStamina: (staminaInfo) =>
        set((state) => ({
          stamina: { ...state.stamina, ...staminaInfo },
        })),

      fetchStamina: async () => {
        try {
          const response = await fetch("/api/user/stamina", {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            get().setStamina({
              current: data.current,
              max: data.subscription === "UNLIMITED" ? "UNLIMITED" : data.max,
              subscription: data.subscription,
              lastReset: data.lastReset,
            });
          }
        } catch (error) {
          console.error("Failed to fetch stamina:", error);
        }
      },

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
            await get().fetchStamina();
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
