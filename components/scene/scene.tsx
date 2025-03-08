"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import SceneDialog from "./scene-dialog";
import SceneDialogSelection from "./scene-dialog-selection";
import SceneCharacter from "./scene-character";
import { useScene } from "@/lib/contexts/SceneContext";

export default function Scene() {
  const params = useParams();
  const {
    loading,
    error,
    currentScene,
    character,
    selectedChoice,
    isChoiceProcessing,
    fetchSceneData,
    handleChoiceSelect,
    handlePreviousScene,
    handleNextScene,
    handleMintScene,
    user,
    currentIndex,
    allScenes,
    setCurrentIndex,
    setCurrentScene,
    setSelectedChoice,
  } = useScene();

  // Initial data fetching
  useEffect(() => {
    if (params.characterId) {
      fetchSceneData(params.characterId as string);
    }
  }, [params.characterId]);

  // Polling mechanism for scene generation status
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout;

    const pollSceneStatus = async () => {
      if (currentScene?.status === "GENERATING" && currentScene?.id) {
        try {
          const response = await fetch(`/api/scene?sceneId=${currentScene.id}`);
          const data = await response.json();

          // Check if data and scene exist before accessing status
          if (data?.scene?.status === "COMPLETED") {
            // Update only the current scene instead of fetching all data
            setCurrentScene({
              ...currentScene,
              ...data.scene,
              _updateKey: Date.now(),
            });
          } else if (data?.scene?.status === "FAILED") {
            setError("Failed to generate scene. Please try again.");
          }
        } catch (error) {
          console.error("Error polling scene status:", error);
          setError("Error checking scene status");
        }
      }
    };

    if (currentScene?.status === "GENERATING") {
      pollingInterval = setInterval(pollSceneStatus, 2000);
    }

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [currentScene?.status, currentScene?.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentScene) {
    return <div>No scene available</div>;
  }

  if (currentScene.status === "GENERATING") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Generating your story...</p>
          <p className="text-sm text-gray-600 mt-2">
            This may take a few moments
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-11/12 md:w-4/5 mx-auto grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 h-full">
      <div className="col-span-1 md:col-span-3 text-center md:text-start flex flex-col justify-end">
        <SceneDialogSelection
          key={`selection-${currentScene?._updateKey || 0}-${currentIndex}`}
          choices={currentScene?.choices || []}
          onChoiceSelect={handleChoiceSelect}
          selectedChoice={selectedChoice}
          previousChoice={currentScene?.userChoices?.[0]?.choiceIndex}
          isProcessing={isChoiceProcessing}
          isHistoricalScene={Boolean(currentScene?.userChoices?.length)}
        />
      </div>
      <div className="col-span-1 text-center">
        <SceneCharacter
          key={`character-${currentScene._updateKey || 0}`}
          imageUrl={currentScene.imageUrl}
        />
      </div>
      <div className="col-span-1 md:col-span-4 text-center h-44 sm:h-40 md:h-48 rounded-xl -mb-4 sm:-mb-6 md:-mb-8">
        {character && (
          <SceneDialog
            key={`dialog-${currentScene?._updateKey || 0}-${currentIndex}`}
            scene={currentScene}
            character={character}
            stamina={user?.stamina || 0}
            allScenes={allScenes}
            onPrevious={handlePreviousScene}
            onNext={handleNextScene}
            onMint={handleMintScene}
            isFirstScene={currentIndex === 0}
            isLastScene={currentIndex === allScenes.length - 1}
            disableNext={
              !selectedChoice && currentScene?.userChoices?.length === 0
            }
            onSceneSelect={(index) => {
              const selectedScene = allScenes[index];
              setCurrentIndex(index);
              setCurrentScene({ ...selectedScene, _updateKey: Date.now() });
              // Update selected choice based on the selected scene's choices
              setSelectedChoice(selectedScene.userChoices?.[0]?.choiceIndex);
            }}
            currentIndex={currentIndex}
          />
        )}
      </div>
    </div>
  );
}
function setError(message: string) {
  console.error(message);
  // You might want to add proper error handling here
  // For example, using a state variable or a toast notification
}
