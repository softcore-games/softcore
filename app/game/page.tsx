'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { SceneManager } from '@/lib/game/SceneManager';
import { AICharacterSystem } from '@/lib/game/AICharacterSystem';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/lib/hooks/useWallet';

// Initialize game systems
const sceneManager = new SceneManager();
const aiSystem = new AICharacterSystem(process.env.NEXT_PUBLIC_OPENAI_API_KEY || '');

// Test scenes
const testScenes = [
  {
    id: 'intro',
    background: 'https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6',
    character: {
      id: 'alice',
      name: 'Alice',
      description: 'A mysterious guide through the digital realm.',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    },
    dialogue: "Welcome to the test environment. I'm Alice, and I'll be your guide.",
    choices: [
      {
        text: 'Nice to meet you, Alice',
        nextScene: 'scene1',
        relationshipEffect: { alice: 1 },
      },
      {
        text: "Let's get started",
        nextScene: 'scene1',
      },
    ],
  },
  {
    id: 'scene1',
    background: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986',
    character: {
      id: 'alice',
      name: 'Alice',
      description: 'A mysterious guide through the digital realm.',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    },
    dialogue:
      'This is a test scene. You can try different choices and see how they affect the story.',
    choices: [
      {
        text: 'Tell me more about this world',
        nextScene: 'scene2',
        relationshipEffect: { alice: 2 },
      },
      {
        text: 'I want to explore on my own',
        nextScene: 'scene2',
        relationshipEffect: { alice: -1 },
      },
    ],
  },
  {
    id: 'scene2',
    background: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
    character: {
      id: 'alice',
      name: 'Alice',
      description: 'A mysterious guide through the digital realm.',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    },
    dialogue: "Your choices affect our relationship and the story's direction.",
    choices: [
      {
        text: 'I appreciate your guidance',
        nextScene: 'intro',
        relationshipEffect: { alice: 2 },
      },
      {
        text: 'Restart the test',
        nextScene: 'intro',
      },
    ],
  },
];

// Load test scenes
testScenes.forEach((scene) => sceneManager.loadScene(scene));

// Add test character
aiSystem.addCharacter({
  id: 'alice',
  name: 'Alice',
  description: 'A mysterious guide through the digital realm.',
  imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
});

export default function GameTest() {
  const { account, isConnectedToCore, connectWallet, switchToCore } = useWallet();
  const gameState = useGameStore();
  const [currentScene, setCurrentScene] = useState(sceneManager.getScene('intro'));
  const [aiResponse, setAiResponse] = useState('');
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    const scene = sceneManager.getScene(gameState.currentScene);
    if (scene) {
      setCurrentScene(scene);
    }
  }, [gameState.currentScene]);

  const handleChoice = async (choice: any) => {
    try {
      await sceneManager.processChoice(choice, gameState);
    } catch (error: any) {
      console.error('Error processing choice:', error);
    }
  };

  const handleAIInteraction = async () => {
    if (!userInput.trim()) return;

    const response = await aiSystem.generateResponse('alice', userInput, {
      relationshipValue: gameState.relationships['alice'] || 0,
      previousChoices: gameState.choices,
      currentScene: gameState.currentScene,
    });

    setAiResponse(response || '');
    setUserInput('');
  };

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="mb-4 text-2xl font-bold">Connect Wallet to Play</h1>
          <Button onClick={connectWallet}>Connect Wallet</Button>
        </Card>
      </div>
    );
  }

  if (!isConnectedToCore) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="mb-4 text-2xl font-bold">Switch to Core Network</h1>
          <Button onClick={switchToCore}>Switch Network</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="space-y-6">
          {/* Scene Display */}
          <div
            className="h-64 w-full rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${currentScene?.background})` }}
          />

          {/* Character and Dialogue */}
          <div className="flex items-start space-x-4">
            <img
              src={currentScene?.character?.imageUrl}
              alt={currentScene?.character?.name}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-bold">{currentScene?.character?.name}</h3>
              <p className="text-gray-700">{currentScene?.dialogue}</p>
            </div>
          </div>

          {/* Choices */}
          <div className="space-y-2">
            {currentScene?.choices.map((choice, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => handleChoice(choice)}
              >
                {choice.text}
              </Button>
            ))}
          </div>

          {/* AI Interaction */}
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Talk to Alice..."
                onKeyPress={(e) => e.key === 'Enter' && handleAIInteraction()}
              />
              <Button onClick={handleAIInteraction}>Send</Button>
            </div>
            {aiResponse && (
              <div className="rounded-lg bg-gray-100 p-4">
                <p className="text-sm">{aiResponse}</p>
              </div>
            )}
          </div>

          {/* Game State Display */}
          <div className="mt-4 rounded-lg bg-gray-100 p-4">
            <h4 className="mb-2 font-bold">Game State</h4>
            <p>Relationship with Alice: {gameState.relationships['alice'] || 0}</p>
            <p>Choices made: {gameState.choices.length}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
