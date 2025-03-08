"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Scene, Character, User, SceneContextType } from "@/types/game";

const SceneContext = createContext<SceneContextType | undefined>(undefined);

// API utility functions
const api = {
  async fetchData(characterId: string) {
    const [characterRes, scenesRes, userRes] = await Promise.all([
      fetch(`/api/character?characterId=${characterId}`),
      fetch(`/api/scene?characterId=${characterId}`),
      fetch("/api/auth/verify"),
    ]);

    if (!characterRes.ok || !scenesRes.ok || !userRes.ok) {
      throw new Error("Failed to fetch required data");
    }

    return Promise.all([characterRes.json(), scenesRes.json(), userRes.json()]);
  },

  async generateScene(characterId: string, sceneNumber?: number) {
    const response = await fetch("/api/scene", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId, sceneNumber }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate scene");
    }

    return response.json();
  },

  async saveChoice(sceneId: string, choiceIndex: number, choiceText: string) {
    const response = await fetch("/api/scene/choice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sceneId, choiceIndex, choiceText }),
    });

    if (!response.ok) {
      throw new Error("Failed to save choice");
    }

    return response.json();
  },

  async updateStamina(decrease: boolean) {
    const response = await fetch("/api/user/stamina", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decrease }),
    });

    if (!response.ok) {
      throw new Error("Failed to update stamina");
    }

    return response.json();
  },

  async mintScene(sceneId: string) {
    const response = await fetch("/api/mint-scene", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sceneId }),
    });

    if (!response.ok) {
      throw new Error("Failed to mint scene");
    }

    return response.json();
  },
};

export function SceneProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [allScenes, setAllScenes] = useState<Scene[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | undefined>(
    undefined
  );
  const [user, setUser] = useState<User | null>(null);
  const [isChoiceProcessing, setIsChoiceProcessing] = useState(false);

  const fetchSceneData = async (characterId: string) => {
    try {
      setLoading(true);
      setError(null);

      const [characterData, scenesData, userData] = await api.fetchData(
        characterId
      );

      setCharacter(characterData.character);
      setUser(userData.user);

      if (scenesData.scenes?.length > 0) {
        // Prevent duplicate scenes by checking IDs
        const uniqueScenes = scenesData.scenes.filter(
          (scene: Scene, index: number, self: Scene[]) =>
            index === self.findIndex((s) => s.id === scene.id)
        );

        setAllScenes(uniqueScenes);
        setCurrentScene(uniqueScenes[0]);
        if (uniqueScenes[0].userChoices?.[0]?.choiceIndex !== undefined) {
          setSelectedChoice(uniqueScenes[0].userChoices[0].choiceIndex);
        }
      } else {
        const generatedData = await api.generateScene(characterId);
        if (generatedData.scene) {
          setAllScenes([generatedData.scene]);
          setCurrentScene(generatedData.scene);
        } else {
          throw new Error("No scene data received from generation");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load game data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChoiceSelect = async (choice: string, index: number) => {
    if (!currentScene || isChoiceProcessing || !character?.id) return;

    const hasExistingChoice =
      currentScene.userChoices && currentScene.userChoices.length > 0;
    if (hasExistingChoice) {
      alert("You cannot change your previous choice.");
      return;
    }

    if (!user?.stamina || user.stamina <= 0) {
      alert("Insufficient stamina! Please purchase more to continue.");
      return;
    }

    setIsChoiceProcessing(true);
    setSelectedChoice(index);

    try {
      // Save the choice
      await api.saveChoice(currentScene.id, index, choice);

      // Update stamina
      const { user: updatedUser } = await api.updateStamina(true);
      setUser(updatedUser);

      // Update current scene with the choice
      setCurrentScene((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          userChoices: [
            {
              choiceIndex: index,
              choiceText: choice,
              sceneId: prev.id,
            },
          ],
        };
      });

      // Wait a moment to show the selection
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate next scene if not at the end
      const nextSceneNumber = currentScene.sceneNumber + 1;
      if (nextSceneNumber <= 10) {
        let retries = 0;
        const maxRetries = 3;

        while (retries < maxRetries) {
          try {
            const data = await api.generateScene(character.id, nextSceneNumber);

            if (data.scene.status === "GENERATING") {
              // Wait and retry if scene is still generating
              await new Promise((resolve) => setTimeout(resolve, 2000));
              retries++;
              continue;
            }

            setAllScenes((prev) => [...prev, data.scene]);
            setCurrentScene(data.scene);
            setCurrentIndex(nextSceneNumber - 1);
            setSelectedChoice(undefined);
            break;
          } catch (error) {
            if (retries === maxRetries - 1) throw error;
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }
    } catch (error) {
      console.error("Error processing choice:", error);
      setSelectedChoice(undefined);
      alert("Failed to process your choice. Please try again.");
    } finally {
      setIsChoiceProcessing(false);
    }
  };

  const handleNextScene = async () => {
    if (!character?.id) return;

    try {
      const nextSceneNumber = currentScene ? currentScene.sceneNumber + 1 : 1;
      if (nextSceneNumber > 10) return;

      const data = await api.generateScene(character.id, nextSceneNumber);
      setAllScenes((prev) => [...prev, data.scene]);
      setCurrentScene(data.scene);
      setCurrentIndex(nextSceneNumber - 1);
      setSelectedChoice(undefined);
    } catch (error) {
      console.error("Error loading next scene:", error);
      setError("Failed to load next scene");
    }
  };

  const handlePreviousScene = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const scene = allScenes[newIndex];
      setCurrentIndex(newIndex);
      setCurrentScene({ ...scene, _updateKey: Date.now() });

      if (scene.userChoices && scene.userChoices.length > 0) {
        setSelectedChoice(scene.userChoices[0].choiceIndex);
      } else {
        setSelectedChoice(undefined);
      }
    }
  };

  const handleSceneSelect = (index: number) => {
    const selectedScene = allScenes[index];
    setCurrentIndex(index);
    setCurrentScene({ ...selectedScene, _updateKey: Date.now() });

    // If the scene has user choices, set the selected choice
    // Otherwise, reset the selected choice
    if (selectedScene.userChoices && selectedScene.userChoices.length > 0) {
      setSelectedChoice(selectedScene.userChoices[0].choiceIndex);
    } else {
      setSelectedChoice(undefined);
    }
  };

  const handleMintScene = async () => {
    if (!currentScene) return;

    try {
      await api.mintScene(currentScene.id);
      setCurrentScene((prev) => (prev ? { ...prev, nftMinted: true } : null));
    } catch (error) {
      console.error("Error minting scene:", error);
      throw error;
    }
  };

  return (
    <SceneContext.Provider
      value={{
        loading,
        error,
        character,
        allScenes,
        currentScene,
        currentIndex,
        selectedChoice,
        setSelectedChoice,
        user,
        isChoiceProcessing,
        fetchSceneData,
        handleChoiceSelect,
        handleNextScene,
        handlePreviousScene,
        handleSceneSelect,
        handleMintScene,
        setCurrentIndex,
        setCurrentScene,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const context = useContext(SceneContext);
  if (context === undefined) {
    throw new Error("useScene must be used within a SceneProvider");
  }
  return context;
}
