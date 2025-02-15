'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Plus, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { NewCharacterDialog } from './NewCharacterDialog';
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

interface Character {
  id: string;
  characterId: string;
  name: string;
  personality: string;
  background: string;
  traits: string[];
  relationships?: Record<string, any>;
  emotions: Record<string, string>;
  images: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface CharactersListProps {
  characters: Character[];
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CharactersList({ characters, onExport, onImport }: CharactersListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [deletingCharacter, setDeletingCharacter] = useState<Character | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingCharacter) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/characters/${deletingCharacter.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Character deleted successfully',
        });
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete character',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the character',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeletingCharacter(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Character Management</h2>
        <div className="flex gap-4">
          <Button
            onClick={onExport}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Characters
          </Button>
          <Button
            onClick={() => document.getElementById('import-characters')?.click()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Characters
          </Button>
          <input
            id="import-characters"
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
            New Character
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {characters.map((character) => (
          <div
            key={character.id}
            className="group bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-750 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-blue-400">
                  {character.name}
                </h2>
                <span className="text-sm text-gray-400">ID: {character.characterId}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  Updated: {new Date(character.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditingCharacter(character)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeletingCharacter(character)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">
                  Personality
                </h3>
                <p className="text-gray-300">{character.personality}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">
                  Background
                </h3>
                <p className="text-gray-300">{character.background}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">
                  Traits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {character.traits.map((trait) => (
                    <span
                      key={trait}
                      className="px-2 py-1 bg-gray-700 rounded text-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">
                  Emotions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(character.emotions).map(([emotion, description]) => (
                    <span
                      key={emotion}
                      className="px-2 py-1 bg-gray-700 rounded text-sm"
                      title={description}
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewCharacterDialog
        open={showNewDialog || !!editingCharacter}
        onOpenChange={(open) => {
          setShowNewDialog(open);
          if (!open) setEditingCharacter(null);
        }}
        onSuccess={() => {
          setShowNewDialog(false);
          setEditingCharacter(null);
          router.refresh();
        }}
        editingCharacter={editingCharacter}
      />

      <AlertDialog open={!!deletingCharacter} onOpenChange={() => setDeletingCharacter(null)}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Character</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this character? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-gray-700 hover:bg-gray-600"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}