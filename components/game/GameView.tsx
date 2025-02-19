"use client";
import React, { useEffect, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import { DialogueBox } from "./DialogueBox";
import { CharacterSprite } from "./CharacterSprite";
import { ChoiceMenu } from "./ChoiceMenu";
import { Background } from "./Background";
import { LoadingView } from "./LoadingView";

export function GameView() {
  const {
    currentScene,
    isLoading,
    displayText,
    isDialogueComplete,
    isProcessingChoice,
    fetchScene,
    setDialogueComplete,
    addChoice,
    scenes,
  } = useGameStore();

  // Initialize game
  const initializeGame = useCallback(async () => {
    console.log("Initializing game...", { currentScene, scenes });
    if (!currentScene && !isProcessingChoice && scenes.length === 0) {
      console.log("Fetching first scene...");
      await fetchScene();
    }
  }, [currentScene, isProcessingChoice, scenes, fetchScene]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleChoice = async (choice: { text: string; next: string }) => {
    console.log("Handling choice:", choice);
    addChoice(choice.text);
    await fetchScene(currentScene, choice);
  };

  const handleContinue = () => {
    console.log("Continuing to next scene...");
    if (currentScene?.next) {
      fetchScene(currentScene);
    }
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (!currentScene) {
    return <LoadingView isError={true} />;
  }

  console.log("Rendering scene:", currentScene);

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <Background
        imageUrl={currentScene.backgroundImage}
        fallback={currentScene.background}
      />

      <CharacterSprite
        name={currentScene.character}
        emotion={currentScene.emotion}
        imageUrl={currentScene.characterImage}
        speaking={!isDialogueComplete}
      />

      <DialogueBox
        speaker={currentScene.character}
        text={displayText}
        onComplete={() => setDialogueComplete(true)}
      />

      {isDialogueComplete && currentScene.choices && (
        <ChoiceMenu
          choices={currentScene.choices.map(
            (choice: { text: string; next: string }) => ({
              text: choice.text,
              action: () => handleChoice(choice),
            })
          )}
          isProcessingChoice={isProcessingChoice}
        />
      )}

      {isDialogueComplete && !currentScene.choices && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={handleContinue}
        />
      )}
    </main>
  );
}
