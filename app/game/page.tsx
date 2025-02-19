"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DialogueBox } from "@/components/game/DialogueBox";
import { CharacterSprite } from "@/components/game/CharacterSprite";
import { ChoiceMenu } from "@/components/game/ChoiceMenu";
import { StaminaBar } from "@/components/StaminaBar";
import { NFTMinter } from "@/components/NFTMinter";

import { SceneImageGenerator } from "@/components/SceneImageGenerator";
import { useGameStore } from "@/store/gameStore";
import { getGameScript, type Scene, generateScene } from "@/lib/game/script";
import {
  generateDialogue,
  getCachedDialogue,
  cacheDialogue,
} from "@/lib/game/dialogue";
import Image from "next/image";

export default function GamePage() {
  return <GameContent />;
}

function GameContent() {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [displayText, setDisplayText] = useState("");
  const [isDialogueComplete, setIsDialogueComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stamina, setStamina] = useState({
    current: 0,
    max: 0,
    subscription: "FREE",
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { addChoice, choices } = useGameStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stamina
        const staminaResponse = await fetch("/api/user/stamina", {
          credentials: "include",
        });

        if (!staminaResponse.ok) {
          if (staminaResponse.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch stamina");
        }

        const staminaData = await staminaResponse.json();
        setStamina({
          current: staminaData.stamina,
          max: staminaData.maxStamina,
          subscription: staminaData.subscription,
        });

        // Start with completely random scene
        const response = await fetch("/api/game/scene", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error("Failed to generate scene");
        const randomScene = await response.json();

        setScenes([randomScene]);
        setCurrentScene(randomScene);
        setDisplayText(randomScene.text);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (!currentScene) return;

    const loadDialogue = async () => {
      if (currentScene.requiresAI) {
        setIsLoading(true);

        // Check cache first
        const cachedResponse = getCachedDialogue(currentScene.id, choices);
        if (cachedResponse) {
          setDisplayText(cachedResponse);
          setIsLoading(false);
          return;
        }

        // Generate new response
        const response = await generateDialogue(currentScene, choices);
        if (response) {
          setDisplayText(response);
          cacheDialogue(currentScene.id, choices, response);
        } else {
          setDisplayText(currentScene.text);
        }
        setIsLoading(false);
      } else {
        setDisplayText(currentScene.text);
      }
    };

    loadDialogue();
  }, [currentScene, choices]);

  const handleDialogueComplete = () => {
    setIsDialogueComplete(true);
  };

  const handleChoice = async (choice: { text: string; next: string }) => {
    addChoice(choice.text);
    setIsLoading(true);
    try {
      const response = await fetch("/api/game/scene", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          previousScene: currentScene,
          playerChoice: choice.text,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate scene");
      const nextScene = await response.json();

      setCurrentScene(nextScene);
      setIsDialogueComplete(false);
      setGeneratedImage(null);
    } catch (error) {
      console.error("Failed to generate next scene:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/game/scene", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          previousScene: currentScene,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate scene");
      const nextScene = await response.json();

      setCurrentScene(nextScene);
      setIsDialogueComplete(false);
      setGeneratedImage(null);
    } catch (error) {
      console.error("Failed to generate next scene:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePrompt = (scene: Scene) => {
    return `A dynamic anime-style scene featuring ${scene.character} 
    in ${scene.background} environment showing ${scene.emotion} emotion.
    Unexpected story moment, surreal elements allowed. 
    High-quality, detailed, and imaginative artwork.`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!currentScene) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl text-gray-400">No scenes available</div>
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <StaminaBar
        currentStamina={stamina.current}
        maxStamina={stamina.max}
        subscription={stamina.subscription}
      />

      <div className="absolute inset-0">
        <Image
          src={`/backgrounds/${currentScene.background || "classroom"}.jpg`}
          alt={`${currentScene.background || "classroom"} background`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <CharacterSprite
        name={currentScene.character}
        emotion={currentScene.emotion}
        position="center"
        speaking={!isDialogueComplete}
      />

      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => {
          if (isDialogueComplete && !currentScene.choices) {
            handleContinue();
          }
        }}
      />

      <DialogueBox
        speaker={currentScene.character === "mei" ? "Mei" : "Lily"}
        text={displayText}
        onComplete={handleDialogueComplete}
      />

      {isDialogueComplete && (
        <div className="fixed right-4 top-20 space-y-4 w-64">
          <SceneImageGenerator
            sceneId={currentScene.sceneId}
            prompt={generatePrompt(currentScene)}
            onImageGenerated={setGeneratedImage}
          />

          {generatedImage && (
            <NFTMinter
              imageUrl={generatedImage}
              metadata={{
                name: `Scene: ${currentScene.sceneId}`,
                description: `A special moment featuring ${
                  currentScene.character
                } showing ${currentScene.emotion}. Background: ${
                  currentScene.background || "classroom"
                }. Text: ${currentScene.text}`,
              }}
            />
          )}
        </div>
      )}

      {isDialogueComplete && currentScene.choices && (
        <ChoiceMenu
          choices={currentScene.choices.map((choice) => ({
            text: choice.text,
            action: () => handleChoice(choice),
          }))}
        />
      )}
    </main>
  );
}
