'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DialogueBox } from '@/components/game/DialogueBox';
import { CharacterSprite } from '@/components/game/CharacterSprite';
import { ChoiceMenu } from '@/components/game/ChoiceMenu';
import { StaminaBar } from '@/components/StaminaBar';
import { NFTMinter } from '@/components/NFTMinter';
import { SceneImageGenerator } from '@/components/SceneImageGenerator';
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
  const [stamina, setStamina] = useState({ current: 0, max: 0, subscription: 'FREE' });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { addChoice, choices } = useGameStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch stamina
        const staminaResponse = await fetch('/api/user/stamina', {
          credentials: 'include',
        });
        if (staminaResponse.ok) {
          const staminaData = await staminaResponse.json();
          setStamina({
            current: staminaData.stamina,
            max: staminaData.maxStamina,
            subscription: staminaData.subscription,
          });
        }

        // Fetch scenes
        const fetchedScenes = await getGameScript();
        if (fetchedScenes.length > 0) {
          setScenes(fetchedScenes);
          // Get a random scene that requires AI
          const aiScenes = fetchedScenes.filter(scene => scene.requiresAI);
          const randomScene = aiScenes[Math.floor(Math.random() * aiScenes.length)] || fetchedScenes[0];
          setCurrentScene(randomScene);
          setDisplayText(randomScene.text);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
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

  const handleChoice = (choice: { text: string; next: string }) => {
    addChoice(choice.text);
    const nextScene = scenes.find((scene) => scene.sceneId === choice.next);
    if (nextScene) {
      setCurrentScene(nextScene);
      setIsDialogueComplete(false);
      setGeneratedImage(null); // Reset generated image for new scene
    }
  };

  const handleContinue = () => {
    if (currentScene?.next) {
      const nextScene = scenes.find((scene) => scene.sceneId === currentScene.next);
      if (nextScene) {
        setCurrentScene(nextScene);
        setIsDialogueComplete(false);
        setGeneratedImage(null); // Reset generated image for new scene
      }
    } else {
      // Get another random AI scene
      const aiScenes = scenes.filter(scene => scene.requiresAI);
      const randomScene = aiScenes[Math.floor(Math.random() * aiScenes.length)];
      if (randomScene) {
        setCurrentScene(randomScene);
        setIsDialogueComplete(false);
        setGeneratedImage(null);
      }
    }
  };

  const generatePrompt = (scene: Scene) => {
    return `A beautiful, high-quality anime-style scene featuring ${scene.character} 
    showing ${scene.emotion} emotion. Setting: ${scene.background || 'classroom'}. 
    Safe for work, no explicit content. Artistic and detailed.`;
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
                description: `A special moment featuring ${currentScene.character} showing ${currentScene.emotion}. Background: ${currentScene.background || 'classroom'}. Text: ${currentScene.text}`,
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