"use client";

import React, { useEffect } from "react";
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
  } = useGameStore();

  useEffect(() => {
    if (!currentScene && !isProcessingChoice) {
      fetchScene();
    }
  }, [currentScene, isProcessingChoice, fetchScene]);

  const handleChoice = async (choice: { text: string; next: string }) => {
    addChoice(choice.text);
    await fetchScene(currentScene, choice);
  };

  const handleContinue = () => {
    if (currentScene?.next) {
      fetchScene(currentScene);
    }
  };

  if (isLoading || !currentScene) {
    return <LoadingView isError={!currentScene && !isLoading} />;
  }

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
