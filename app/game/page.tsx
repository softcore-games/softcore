'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DialogueBox } from '@/components/game/DialogueBox';
import { CharacterSprite } from '@/components/game/CharacterSprite';
import { ChoiceMenu } from '@/components/game/ChoiceMenu';
import { useGameStore } from '@/store/gameStore';
import { getGameScript, type Scene } from '@/lib/game/script';
import { generateDialogue, getCachedDialogue, cacheDialogue } from '@/lib/game/dialogue';
import Image from 'next/image';

export default function GamePage() {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [displayText, setDisplayText] = useState('');
  const [isDialogueComplete, setIsDialogueComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addChoice, choices } = useGameStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchScenes = async () => {
      try {
        const fetchedScenes = await getGameScript();
        if (fetchedScenes.length > 0) {
          setScenes(fetchedScenes);
          // Find the intro scene or use the first scene
          const introScene = fetchedScenes.find(scene => scene.sceneId === 'intro') || fetchedScenes[0];
          setCurrentScene(introScene);
          setDisplayText(introScene.text);
        }
      } catch (error) {
        console.error('Failed to fetch scenes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenes();
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

  const handleChoice = (choice: { text: string; next: string }) => {
    addChoice(choice.text);
    const nextScene = scenes.find((scene) => scene.sceneId === choice.next);
    if (nextScene) {
      setCurrentScene(nextScene);
      setIsDialogueComplete(false);
    }
  };

  const handleContinue = () => {
    if (currentScene?.next) {
      const nextScene = scenes.find((scene) => scene.sceneId === currentScene.next);
      if (nextScene) {
        setCurrentScene(nextScene);
        setIsDialogueComplete(false);
      }
    }
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
      <div className="absolute inset-0">
        <Image
          src={`/backgrounds/${currentScene.background || 'classroom'}.jpg`}
          alt={`${currentScene.background || 'classroom'} background`}
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
        speaker={currentScene.character === 'mei' ? 'Mei' : 'Lily'}
        text={displayText}
        onComplete={handleDialogueComplete}
      />

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