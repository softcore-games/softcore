'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SceneImageGenerator } from '@/components/SceneImageGenerator';
import { NFTMinter } from '@/components/NFTMinter';
import { StaminaBar } from '@/components/StaminaBar';

interface SceneMintTestProps {
  scene: {
    id: string;
    sceneId: string;
    character: string;
    emotion: string;
    text: string;
    background?: string;
  };
}

export function SceneMintTest({ scene }: SceneMintTestProps) {
  const { toast } = useToast();
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [stamina, setStamina] = useState({ current: 100, max: 100, subscription: 'FREE' });

  // Generate a prompt for the scene
  const generatePrompt = () => {
    return `A beautiful, high-quality anime-style scene featuring ${scene.character} 
    showing ${scene.emotion} emotion. Setting: ${scene.background || 'classroom'}. 
    Safe for work, no explicit content. Artistic and detailed.`;
  };

  // Handle successful image generation
  const handleImageGenerated = (imageUrl: string) => {
    setGeneratedImage(imageUrl);
    toast({
      title: 'Success',
      description: 'Scene image generated successfully',
    });
  };

  // Prepare metadata for NFT
  const nftMetadata = {
    name: `Scene: ${scene.sceneId}`,
    description: `A special moment featuring ${scene.character} showing ${scene.emotion}. 
    Background: ${scene.background || 'classroom'}. 
    Text: ${scene.text}`,
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <StaminaBar
        currentStamina={stamina.current}
        maxStamina={stamina.max}
        subscription={stamina.subscription}
      />

      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Scene Details</h2>
          <div className="space-y-2">
            <p><span className="text-gray-400">Character:</span> {scene.character}</p>
            <p><span className="text-gray-400">Emotion:</span> {scene.emotion}</p>
            <p><span className="text-gray-400">Background:</span> {scene.background || 'classroom'}</p>
            <p><span className="text-gray-400">Text:</span> {scene.text}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Generate Scene Image</h2>
          <SceneImageGenerator
            sceneId={scene.sceneId}
            prompt={generatePrompt()}
            onImageGenerated={handleImageGenerated}
          />
        </div>

        {generatedImage && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Mint as NFT</h2>
            <NFTMinter
              imageUrl={generatedImage}
              metadata={nftMetadata}
            />
          </div>
        )}
      </div>
    </div>
  );
}