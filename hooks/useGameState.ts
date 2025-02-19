import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Scene } from "@/lib/types/game";
import { useGameStore } from "@/store/gameStore";

export function useGameState() {
  const [state, setState] = useState({
    scenes: [] as Scene[],
    currentScene: null as Scene | null,
    isLoading: true,
    displayText: "",
    isDialogueComplete: false,
    isProcessingChoice: false,
  });
  const isLoadingRef = useRef(false);
  const router = useRouter();
  const { addChoice } = useGameStore();

  const fetchScene = async (
    previousScene?: Scene | null,
    playerChoice?: { text: string; next: string }
  ) => {
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
      setState((prev) => ({
        ...prev,
        isLoading: true,
        isProcessingChoice: true,
      }));

      const response = await fetch("/api/game/scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previousScene,
          playerChoice: playerChoice?.next,
        }),
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
        isLoading: false,
        isProcessingChoice: false,
      }));
    } catch (error) {
      console.error("Failed to fetch scene:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isProcessingChoice: false,
      }));
    } finally {
      isLoadingRef.current = false;
    }
  };

  const handleChoice = async (choice: { text: string; next: string }) => {
    if (state.isProcessingChoice) return;
    addChoice(choice.text);
    await fetchScene(state.currentScene, choice);
  };

  const handleContinue = () => {
    if (state.currentScene?.next) {
      fetchScene(state.currentScene);
    }
  };

  const handleDialogueComplete = () => {
    setState((prev) => ({ ...prev, isDialogueComplete: true }));
  };

  useEffect(() => {
    if (state.scenes.length === 0) {
      fetchScene();
    }
  }, []);

  return {
    ...state,
    onChoice: handleChoice,
    onContinue: handleContinue,
    onDialogueComplete: handleDialogueComplete,
  };
}
