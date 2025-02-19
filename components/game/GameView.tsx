"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import { DialogueBox } from "./DialogueBox";
import { CharacterSprite } from "./CharacterSprite";
import { ChoiceMenu } from "./ChoiceMenu";
import { Background } from "./Background";
import { LoadingView } from "./LoadingView";
import { StaminaBar } from "@/components/StaminaBar";

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
  const [stamina, setStamina] = useState({
    current: 0,
    max: 0,
    subscription: "FREE",
  });
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stamina
        const staminaResponse = await fetch("/api/user/stamina", {
          credentials: "include",
        });
        if (staminaResponse.ok) {
          const staminaData = await staminaResponse.json();
          setStamina({
            current: staminaData.stamina,
            max: staminaData.maxStamina,
            subscription: staminaData.subscription,
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
      }
    };

    fetchData();
  }, [currentScene]);

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
      <StaminaBar
        currentStamina={stamina.current}
        maxStamina={stamina.max}
        subscription={stamina.subscription}
      />
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
