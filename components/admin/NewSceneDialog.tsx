'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Scene {
  id: string;
  sceneId: string;
  character: string;
  emotion: string;
  text: string;
  next?: string;
  choices?: { text: string; next: string }[];
  context?: string;
  requiresAI: boolean;
  background?: string;
  type: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface NewSceneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editingScene: Scene | null;
}

export function NewSceneDialog({
  open,
  onOpenChange,
  onSuccess,
  editingScene,
}: NewSceneDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scene, setScene] = useState({
    sceneId: '',
    character: 'mei',
    emotion: 'happy',
    text: '',
    next: '',
    choices: [] as { text: string; next: string }[],
    context: '',
    requiresAI: false,
    background: 'classroom',
    type: 'dialogue',
    metadata: {},
  });

  useEffect(() => {
    if (editingScene) {
      setScene({
        sceneId: editingScene.sceneId,
        character: editingScene.character,
        emotion: editingScene.emotion,
        text: editingScene.text,
        next: editingScene.next || '',
        choices: editingScene.choices || [],
        context: editingScene.context || '',
        requiresAI: editingScene.requiresAI,
        background: editingScene.background || 'classroom',
        type: editingScene.type,
        metadata: editingScene.metadata || {},
      });
    } else {
      setScene({
        sceneId: '',
        character: 'mei',
        emotion: 'happy',
        text: '',
        next: '',
        choices: [],
        context: '',
        requiresAI: false,
        background: 'classroom',
        type: 'dialogue',
        metadata: {},
      });
    }
  }, [editingScene]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingScene
        ? `/api/admin/scenes/${editingScene.id}`
        : '/api/admin/scenes';
      
      const method = editingScene ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scene),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Scene ${editingScene ? 'updated' : 'created'} successfully`,
        });
        onSuccess();
        onOpenChange(false);
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error || `Failed to ${editingScene ? 'update' : 'create'} scene`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addChoice = () => {
    setScene({
      ...scene,
      choices: [...scene.choices, { text: '', next: '' }],
    });
  };

  const removeChoice = (index: number) => {
    setScene({
      ...scene,
      choices: scene.choices.filter((_, i) => i !== index),
    });
  };

  const updateChoice = (index: number, field: 'text' | 'next', value: string) => {
    setScene({
      ...scene,
      choices: scene.choices.map((choice, i) =>
        i === index ? { ...choice, [field]: value } : choice
      ),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingScene ? 'Edit Scene' : 'Create New Scene'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Scene ID</label>
              <Input
                value={scene.sceneId}
                onChange={(e) => setScene({ ...scene, sceneId: e.target.value })}
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={scene.type}
                onValueChange={(value) => setScene({ ...scene, type: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="dialogue">Dialogue</SelectItem>
                  <SelectItem value="choice">Choice</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Character</label>
              <Select
                value={scene.character}
                onValueChange={(value) => setScene({ ...scene, character: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="mei">Mei</SelectItem>
                  <SelectItem value="lily">Lily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Emotion</label>
              <Select
                value={scene.emotion}
                onValueChange={(value) => setScene({ ...scene, emotion: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="curious">Curious</SelectItem>
                  <SelectItem value="excited">Excited</SelectItem>
                  <SelectItem value="thoughtful">Thoughtful</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Text</label>
              <Textarea
                value={scene.text}
                onChange={(e) => setScene({ ...scene, text: e.target.value })}
                required
                className="bg-gray-700 border-gray-600 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Next Scene</label>
              <Input
                value={scene.next}
                onChange={(e) => setScene({ ...scene, next: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Background</label>
              <Select
                value={scene.background}
                onValueChange={(value) => setScene({ ...scene, background: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="classroom">Classroom</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Context</label>
              <Textarea
                value={scene.context}
                onChange={(e) => setScene({ ...scene, context: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="Optional - Used for AI-generated responses"
              />
            </div>

            <div className="col-span-2 flex items-center justify-between py-4 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <Switch
                  checked={scene.requiresAI}
                  onCheckedChange={(checked) =>
                    setScene({ ...scene, requiresAI: checked })
                  }
                />
                <label className="text-sm font-medium">
                  Requires AI Generation
                </label>
              </div>
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Choices</h3>
                <Button
                  type="button"
                  onClick={addChoice}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Choice
                </Button>
              </div>

              <div className="space-y-4">
                {scene.choices.map((choice, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <Input
                        value={choice.text}
                        onChange={(e) =>
                          updateChoice(index, 'text', e.target.value)
                        }
                        placeholder="Choice text"
                        className="bg-gray-700 border-gray-600 mb-2"
                      />
                      <Input
                        value={choice.next}
                        onChange={(e) =>
                          updateChoice(index, 'next', e.target.value)
                        }
                        placeholder="Next scene ID"
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeChoice(index)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/20"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {editingScene ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                editingScene ? 'Update Scene' : 'Create Scene'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}