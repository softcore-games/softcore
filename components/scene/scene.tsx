"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SceneDialog from "./scene-dialog";
import SceneDialogSelection from "./scene-dialog-selection";
import SceneCharacter from "./scene-character";
import { useAuth } from "@/lib/hooks/useAuth";

interface SceneChoice {
  choiceIndex: number;
  choiceText: string;
  sceneId: string;
}

interface Scene {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  choices: string[];
  chapter: number;
  sceneNumber: number;
  nftMinted: boolean;
  userChoices?: SceneChoice[];
  _updateKey?: number;
}

interface Character {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  walletAddress?: string;
  stamina: number;
  selectedCharacterId?: string;
}

export default function Scene() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [allScenes, setAllScenes] = useState<Scene[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | undefined>();
  const [user, setUser] = useState<User | null>(null);
  const [isChoiceProcessing, setIsChoiceProcessing] = useState(false);
  const { verifyAuth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!params.characterId) {
        setError("No character ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [characterRes, scenesRes, userRes] = await Promise.all([
          fetch(`/api/character?characterId=${params.characterId}`),
          fetch(`/api/scene?characterId=${params.characterId}`),
          fetch("/api/auth/verify"),
        ]);

        if (!characterRes.ok || !scenesRes.ok || !userRes.ok) {
          throw new Error("Failed to fetch required data");
        }

        const [characterData, scenesData, userData] = await Promise.all([
          characterRes.json(),
          scenesRes.json(),
          userRes.json(),
        ]);

        setCharacter(characterData.character);
        setUser(userData.user);

        // Check if scenes exist and load them
        if (scenesData.scenes && scenesData.scenes.length > 0) {
          setAllScenes(scenesData.scenes);
          setCurrentScene(scenesData.scenes[0]);

          // Set initial choice if exists
          if (scenesData.scenes[0].userChoices?.[0]) {
            setSelectedChoice(scenesData.scenes[0].userChoices[0].choiceIndex);
          }
        } else {
          // Only generate new scenes if none exist
          const generateResponse = await fetch("/api/scene", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ characterId: params.characterId }),
          });

          if (!generateResponse.ok) {
            throw new Error("Failed to generate initial scenes");
          }

          const generatedData = await generateResponse.json();
          setAllScenes(generatedData.scenes);
          setCurrentScene(generatedData.scenes[0]);
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

    fetchData();
  }, [params.characterId]);

  useEffect(() => {
    if (currentScene) {
      const timestamp = new Date().getTime();
      setCurrentScene((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          _updateKey: timestamp,
        };
      });
    }
  }, [currentIndex]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading game data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!currentScene || !character) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">No scene data available</div>
      </div>
    );
  }

  const syncSceneState = (newIndex: number) => {
    console.log("Syncing scene state to index:", newIndex); // Debug log
    if (newIndex >= 0 && newIndex < allScenes.length) {
      const scene = allScenes[newIndex];
      setCurrentIndex(newIndex);
      setCurrentScene({ ...scene, _updateKey: Date.now() }); // Force update

      // Restore previous choice if it exists
      if (scene.userChoices && scene.userChoices.length > 0) {
        setSelectedChoice(scene.userChoices[0].choiceIndex);
      } else {
        setSelectedChoice(undefined);
      }

      return true;
    }
    return false;
  };

  const handlePreviousScene = () => {
    if (currentIndex > 0) {
      syncSceneState(currentIndex - 1);
    }
  };

  const handleNextScene = () => {
    console.log("Handling next scene. Current index:", currentIndex); // Debug log
    if (currentIndex < allScenes.length - 1) {
      const nextIndex = currentIndex + 1;
      console.log("Moving to index:", nextIndex); // Debug log
      syncSceneState(nextIndex);
    }
  };

  const handleMintScene = async () => {
    if (!currentScene) return;

    try {
      const response = await fetch("/api/mint-scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sceneId: currentScene.id }),
      });

      if (!response.ok) throw new Error("Failed to mint scene");

      setCurrentScene((prev) => (prev ? { ...prev, nftMinted: true } : null));
    } catch (error) {
      console.error("Error minting scene:", error);
      throw error;
    }
  };

  const handleChoiceSelect = async (choice: string, index: number) => {
    if (!currentScene || isChoiceProcessing) return;

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
      const choiceResponse = await fetch("/api/scene/choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sceneId: currentScene.id,
          choiceIndex: index,
          choiceText: choice,
        }),
      });

      if (!choiceResponse.ok) throw new Error("Failed to save choice");

      const staminaResponse = await fetch("/api/user/stamina", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decrease: true }),
      });

      if (!staminaResponse.ok) throw new Error("Failed to update stamina");

      const { user: updatedUser } = await staminaResponse.json();
      setUser(updatedUser);
      await verifyAuth();

      // Update the current scene in allScenes
      const updatedScenes = allScenes.map((scene) =>
        scene.id === currentScene.id
          ? {
              ...scene,
              userChoices: [
                {
                  choiceIndex: index,
                  choiceText: choice,
                  sceneId: scene.id,
                },
              ],
            }
          : scene
      );
      setAllScenes(updatedScenes);

      // Update current scene
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

      // Wait for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Force next scene
      if (currentIndex < updatedScenes.length - 1) {
        console.log("Attempting to move to next scene"); // Debug log
        handleNextScene();
      }
    } catch (error) {
      console.error("Error processing choice:", error);
      setSelectedChoice(undefined);
      alert("Failed to process your choice. Please try again.");
    } finally {
      setIsChoiceProcessing(false);
    }
  };

  // Modify the content display to always show full content
  const getDisplayContent = () => {
    if (!currentScene) return "";
    return currentScene.content;
  };

  return (
    <div className="w-11/12 md:w-4/5 mx-auto grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 h-full">
      <div className="col-span-1 md:col-span-3 text-center md:text-start flex flex-col justify-end">
        <SceneDialogSelection
          key={`selection-${currentScene._updateKey || 0}`}
          choices={currentScene.choices}
          onChoiceSelect={handleChoiceSelect}
          selectedChoice={selectedChoice}
          previousChoice={currentScene.userChoices?.[0]?.choiceIndex}
          isProcessing={isChoiceProcessing}
        />
      </div>
      <div className="col-span-1 text-center">
        <SceneCharacter
          key={`character-${currentScene._updateKey || 0}`}
          imageUrl={character?.imageUrl} // Use character image instead of scene image
        />
      </div>
      <div className="col-span-1 md:col-span-4 text-center h-44 sm:h-40 md:h-48 rounded-xl -mb-4 sm:-mb-6 md:-mb-8">
        <SceneDialog
          key={`dialog-${currentScene._updateKey || 0}`}
          scene={{
            ...currentScene,
            content: getDisplayContent(),
          }}
          character={character}
          stamina={user?.stamina || 0}
          onPrevious={handlePreviousScene}
          onNext={handleNextScene}
          onMint={handleMintScene}
          isFirstScene={currentIndex === 0}
          isLastScene={currentIndex === allScenes.length - 1}
          disableNext={selectedChoice === undefined}
        />
      </div>
    </div>
  );
}
