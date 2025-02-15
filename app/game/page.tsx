import React from 'react';
import { DialogueBox } from '@/components/game/DialogueBox';
import { CharacterSprite } from '@/components/game/CharacterSprite';
import { ChoiceMenu } from '@/components/game/ChoiceMenu';

export default function GamePage() {
  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[url('/backgrounds/classroom.jpg')] bg-cover bg-center" />
      
      <CharacterSprite
        name="mei"
        emotion="happy"
        position="center"
        speaking={true}
      />
      
      <DialogueBox
        speaker="Mei"
        text="Welcome to Softcore! This is where your story begins..."
      />
    </main>
  );
}