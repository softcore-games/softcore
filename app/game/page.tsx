'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DialogueBox } from '@/components/game/DialogueBox';
import { CharacterSprite } from '@/components/game/CharacterSprite';
import { ChoiceMenu } from '@/components/game/ChoiceMenu';
import { useGameStore } from '@/store/gameStore';

// Game script structure
const gameScript = [
  {
    id: 'intro',
    character: 'mei',
    emotion: 'happy',
    text: 'Welcome to Softcore! This is where your story begins...',
    next: 'intro-2',
  },
  {
    id: 'intro-2',
    character: 'mei',
    emotion: 'happy',
    text: 'I\'ll be your guide as you learn programming. Are you ready to start?',
    choices: [
      {
        text: 'Yes, I\'m excited to learn!',
        next: 'lesson-1',
      },
      {
        text: 'I\'m a bit nervous...',
        next: 'encouragement',
      },
    ],
  },
  {
    id: 'encouragement',
    character: 'mei',
    emotion: 'happy',
    text: 'Don\'t worry! We\'ll take it step by step. Everyone starts somewhere!',
    next: 'lesson-1',
  },
  {
    id: 'lesson-1',
    character: 'mei',
    emotion: 'happy',
    text: 'Let\'s start with the basics. In programming, we use variables to store information.',
    next: 'lesson-1-example',
  },
  {
    id: 'lesson-1-example',
    character: 'mei',
    emotion: 'happy',
    text: 'For example: let name = "Mei"; This creates a variable called name that stores my name!',
    choices: [
      {
        text: 'That makes sense!',
        next: 'lesson-1-success',
      },
      {
        text: 'Could you explain more?',
        next: 'lesson-1-detail',
      },
    ],
  },
];

export default function GamePage() {
  const router = useRouter();
  const [currentScene, setCurrentScene] = useState(gameScript[0]);
  const [isDialogueComplete, setIsDialogueComplete] = useState(false);
  const { addChoice } = useGameStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

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

      <DialogueBox
        speaker={currentScene.character === 'mei' ? 'Mei' : undefined}
        text={currentScene.text}
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