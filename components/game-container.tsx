"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

interface GameContainerProps {
  isWalletConnected: boolean;
}

interface GameScene {
  id: string;
  background: string;
  character?: {
    image: string;
    name: string;
  };
  text: string;
  choices?: {
    text: string;
    nextScene: string;
    requiresToken?: boolean;
  }[];
}

const INITIAL_SCENE: GameScene = {
  id: "intro",
  background: "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?q=80&w=2070",
  text: "Welcome to Tech University! Your journey into the world of technology and mystery begins here...",
  choices: [
    {
      text: "Enter the campus",
      nextScene: "campus",
    },
    {
      text: "Check your phone (Premium)",
      nextScene: "phone",
      requiresToken: true,
    },
  ],
};

export function GameContainer({ isWalletConnected }: GameContainerProps) {
  const [currentScene, setCurrentScene] = useState<GameScene>(INITIAL_SCENE);
  const [dialogue, setDialogue] = useState<string>("");

  const handleChoice = (choice: GameScene["choices"][0]) => {
    if (choice.requiresToken && !isWalletConnected) {
      alert("Please connect your wallet to access premium choices!");
      return;
    }
    // TODO: Implement scene transition
    console.log("Selected choice:", choice);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <div className="relative h-[60vh]">
        <Image
          src={currentScene.background}
          alt="Scene background"
          fill
          className="object-cover"
          priority
        />
        {currentScene.character && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <Image
              src={currentScene.character.image}
              alt={currentScene.character.name}
              width={300}
              height={400}
              className="object-contain"
            />
          </div>
        )}
      </div>

      <div className="p-6 bg-card">
        <p className="text-lg mb-6">{currentScene.text}</p>
        
        <div className="flex flex-col gap-3">
          {currentScene.choices?.map((choice, index) => (
            <Button
              key={index}
              onClick={() => handleChoice(choice)}
              variant={choice.requiresToken ? "secondary" : "default"}
              className="w-full justify-start"
              disabled={choice.requiresToken && !isWalletConnected}
            >
              {choice.text}
              {choice.requiresToken && (
                <span className="ml-2 text-sm text-muted-foreground">
                  (Requires CORE tokens)
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}