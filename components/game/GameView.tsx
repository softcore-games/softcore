"use client";
import React, { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { DialogueBox } from "./DialogueBox";
import { CharacterSprite } from "./CharacterSprite";
import { ChoiceMenu } from "./ChoiceMenu";
import { Background } from "./Background";
import { LoadingView } from "./LoadingView";
import { StaminaBar } from "@/components/StaminaBar";
import { NFTMinting } from "@/components/game/NFTMinting";
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
    fetchStamina,
  } = useGameStore();

  useEffect(() => {
    const initGame = async () => {
      await fetchStamina();
      if (!currentScene && !isProcessingChoice && scenes.length === 0) {
        await fetchScene();
      }
    };
    initGame();
  }, []);

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
      <StaminaBar />
      <NFTMinting />
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
