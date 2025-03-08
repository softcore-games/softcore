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
  } = useScene();

  useEffect(() => {
    if (params.characterId) {
      fetchSceneData(params.characterId as string);
    }
  }, [params.characterId]);

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
          imageUrl={currentScene.imageUrl}
        />
      </div>
      <div className="col-span-1 md:col-span-4 text-center h-44 sm:h-40 md:h-48 rounded-xl -mb-4 sm:-mb-6 md:-mb-8">
        <SceneDialog
          key={`dialog-${currentScene._updateKey || 0}`}
          scene={currentScene}
          character={character}
          stamina={user?.stamina || 0}
          onPrevious={handlePreviousScene}
          onNext={handleNextScene}
          onMint={handleMintScene}
          isFirstScene={currentIndex === 0}
          isLastScene={currentIndex === allScenes.length - 1}
          disableNext={
            !selectedChoice && currentScene.userChoices?.length === 0
          }
        />
      </div>
    </div>
  );
}
