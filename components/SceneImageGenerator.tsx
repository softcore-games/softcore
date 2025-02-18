'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface SceneImageGeneratorProps {
  sceneId: string;
  prompt: string;
  onImageGenerated: (imageUrl: string) => void;
}

export function SceneImageGenerator({
  sceneId,
  prompt,
  onImageGenerated,
}: SceneImageGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateImage = async () => {
    setIsGenerating(true);
    try {
      // Check stamina first
      const staminaResponse = await fetch('/api/user/stamina', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'SCENE_GENERATION',
        }),
      });

      if (!staminaResponse.ok) {
        const error = await staminaResponse.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to check stamina',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch('/api/scene/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sceneId,
          prompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedImage(data.imageUrl);
        onImageGenerated(data.imageUrl);
        toast({
          title: 'Success',
          description: 'Image generated successfully',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to generate image',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while generating the image',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {generatedImage ? (
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={generatedImage}
            alt="Generated scene"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <Button
              size="sm"
              onClick={() => window.open(generatedImage, '_blank')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              size="sm"
              onClick={generateImage}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={generateImage}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>
      )}
    </div>
  );
}