import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Scene, GameState } from "@/lib/types/game";
import { useGameStore } from "@/store/gameStore";

export function useGameState() {
  const [state, setState] = useState<GameState>({
    scenes: [],
    currentScene: null,
    isLoading: true,
    displayText: "",
    isDialogueComplete: false,
  });
  const isLoadingRef = useRef(false);
  const router = useRouter();
  const { addChoice, choices } = useGameStore();

  const fetchScene = async (
    previousScene?: Scene | null,
    playerChoice?: string
  ) => {
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await fetch("/api/game/scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousScene, playerChoice }),
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch scene");
      }

      const { scene } = await response.json();

      setState((prev) => ({
        ...prev,
        scenes: [...prev.scenes, scene],
        currentScene: scene,
        displayText: scene.text,
        isDialogueComplete: false,
      }));
    } catch (error) {
      console.error("Failed to fetch scene:", error);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    if (state.scenes.length === 0) {
      fetchScene();
    }
  }, []);

  return {
    ...state,
    onChoice: async (choice: { text: string; next: string }) => {
      addChoice(choice.text);
      await fetchScene(state.currentScene, choice.text);
    },
    onContinue: () => fetchScene(state.currentScene),
    onDialogueComplete: () =>
      setState((prev) => ({ ...prev, isDialogueComplete: true })),
  };
}
