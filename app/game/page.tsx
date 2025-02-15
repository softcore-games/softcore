'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DialogueBox } from '@/components/game/DialogueBox';
import { CharacterSprite } from '@/components/game/CharacterSprite';
import { ChoiceMenu } from '@/components/game/ChoiceMenu';
import { useGameStore } from '@/store/gameStore';
import { gameScript } from '@/lib/game/script';
import { generateDialogue, getCachedDialogue, cacheDialogue } from '@/lib/game/dialogue';

export default function GamePage() {
  const router = useRouter();
  const [currentScene, setCurrentScene] = useState(gameScript[0]);
  const [displayText, setDisplayText] = useState(currentScene.text);
  const [isDialogueComplete, setIsDialogueComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addChoice, choices } = useGameStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
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
        setDisplayText(response);
        cacheDialogue(currentScene.id, choices, response);
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

  const handleChoice = (choice: { text: string; next: string }) => {
    addChoice(choice.text);
    const nextScene = gameScript.find((scene) => scene.id === choice.next);
    if (nextScene) {
      setCurrentScene(nextScene);
      setIsDialogueComplete(false);
    }
  };

  const handleContinue = () => {
    if (currentScene.next) {
      const nextScene = gameScript.find((scene) => scene.id === currentScene.next);
      if (nextScene) {
        setCurrentScene(nextScene);
        setIsDialogueComplete(false);
      }
    }
  };

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[url('/backgrounds/classroom.jpg')] bg-cover bg-center" />
      
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

      {isLoading ? (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 text-white p-6 min-h-[200px] flex items-center justify-center">
          <div className="animate-pulse text-xl text-blue-400">
            Thinking...
          </div>
        </div>
      ) : (
        <DialogueBox
          speaker={currentScene.character === 'mei' ? 'Mei' : undefined}
          text={displayText}
          onComplete={handleDialogueComplete}
        />
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