'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Plus, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

interface ScenesListProps {
  scenes: Scene[];
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ScenesList({ scenes, onExport, onImport }: ScenesListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [deletingScene, setDeletingScene] = useState<Scene | null>(null);

  const handleDelete = async () => {
    if (!deletingScene) return;

    try {
      const response = await fetch(`/api/admin/scenes/${deletingScene.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Scene deleted successfully',
        });
        router.refresh();
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete scene',
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
      setDeletingScene(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Scene Management</h2>
        <div className="flex gap-4">
          <Button
            onClick={onExport}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Scenes
          </Button>
          <Button
            onClick={() => document.getElementById('import-scenes')?.click()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Scenes
          </Button>
          <input
            id="import-scenes"
            type="file"
            accept=".json"
            onChange={onImport}
            className="hidden"
          />
          <Button
            onClick={() => setShowNewDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Scene
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className="group bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-750 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-blue-400">
                  {scene.sceneId}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {scene.character}
                  </span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {scene.emotion}
                  </span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {scene.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-500">
                  Updated: {new Date(scene.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditingScene(scene)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeletingScene(scene)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Text</h3>
                <p className="text-gray-300">{scene.text}</p>
              </div>

              {scene.context && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Context</h3>
                  <p className="text-gray-300">{scene.context}</p>
                </div>
              )}

              {scene.background && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Background</h3>
                  <span className="px-2 py-1 bg-gray-700 rounded text-sm">
                    {scene.background}
                  </span>
                </div>
              )}

              {scene.next && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Next Scene</h3>
                  <span className="px-2 py-1 bg-gray-700 rounded text-sm">
                    {scene.next}
                  </span>
                </div>
              )}

              {scene.choices && scene.choices.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Choices</h3>
                  <div className="space-y-2">
                    {scene.choices.map((choice, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <span className="text-blue-400">→</span>
                        {choice.text}
                        <span className="text-gray-500">({choice.next})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {scene.requiresAI && (
                <div className="mt-2">
                  <span className="px-2 py-1 bg-purple-700 rounded text-sm">
                    AI Generated
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!deletingScene} onOpenChange={() => setDeletingScene(null)}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scene</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scene? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}