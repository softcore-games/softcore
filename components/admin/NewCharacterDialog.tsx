"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash } from "lucide-react";
import { Character } from "@/lib/types/game";

interface NewCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editingCharacter: Character | null;
}

export function NewCharacterDialog({
  open,
  onOpenChange,
  onSuccess,
  editingCharacter,
}: NewCharacterDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [character, setCharacter] = useState({
    characterId: "",
    name: "",
    personality: "",
    background: "",
    traits: [] as string[],
    relationships: {},
    emotions: {} as Record<string, string>,
    images: {},
  });
  const [newTrait, setNewTrait] = useState("");
  const [newEmotion, setNewEmotion] = useState({ name: "", description: "" });

  useEffect(() => {
    if (editingCharacter) {
      setCharacter({
        characterId: editingCharacter.characterId,
        name: editingCharacter.name,
        personality: editingCharacter.personality,
        background: editingCharacter.background,
        traits: editingCharacter.traits,
        relationships: editingCharacter.relationships || {},
        emotions: editingCharacter.emotions,
        images: editingCharacter.images,
      });
    } else {
      setCharacter({
        characterId: "",
        name: "",
        personality: "",
        background: "",
        traits: [],
        relationships: {},
        emotions: {},
        images: {},
      });
    }
  }, [editingCharacter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingCharacter
        ? `/api/admin/characters/${editingCharacter.id}`
        : "/api/admin/characters";

      const method = editingCharacter ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(character),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Character ${
            editingCharacter ? "updated" : "created"
          } successfully`,
        });
        onSuccess();
        onOpenChange(false);
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description:
            data.error ||
            `Failed to ${editingCharacter ? "update" : "create"} character`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTrait = () => {
    if (newTrait.trim()) {
      setCharacter({
        ...character,
        traits: [...character.traits, newTrait.trim()],
      });
      setNewTrait("");
    }
  };

  const removeTrait = (index: number) => {
    setCharacter({
      ...character,
      traits: character.traits.filter((_, i) => i !== index),
    });
  };

  const addEmotion = () => {
    if (newEmotion.name.trim() && newEmotion.description.trim()) {
      setCharacter({
        ...character,
        emotions: {
          ...character.emotions,
          [newEmotion.name]: newEmotion.description,
        },
      });
      setNewEmotion({ name: "", description: "" });
    }
  };

  const removeEmotion = (emotionName: string) => {
    const { [emotionName]: _, ...remainingEmotions } = character.emotions;
    setCharacter({
      ...character,
      emotions: remainingEmotions,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingCharacter ? "Edit Character" : "Create New Character"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Character ID</label>
              <Input
                value={character.characterId}
                onChange={(e) =>
                  setCharacter({ ...character, characterId: e.target.value })
                }
                required
                className="bg-gray-700 border-gray-600"
                placeholder="e.g., mei"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={character.name}
                onChange={(e) =>
                  setCharacter({ ...character, name: e.target.value })
                }
                required
                className="bg-gray-700 border-gray-600"
                placeholder="e.g., Mei"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Personality</label>
              <Textarea
                value={character.personality}
                onChange={(e) =>
                  setCharacter({ ...character, personality: e.target.value })
                }
                required
                className="bg-gray-700 border-gray-600"
                placeholder="Describe the character's personality..."
              />
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Background</label>
              <Textarea
                value={character.background}
                onChange={(e) =>
                  setCharacter({ ...character, background: e.target.value })
                }
                required
                className="bg-gray-700 border-gray-600"
                placeholder="Describe the character's background..."
              />
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Traits</h3>
                <div className="flex gap-2">
                  <Input
                    value={newTrait}
                    onChange={(e) => setNewTrait(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                    placeholder="New trait"
                  />
                  <Button
                    type="button"
                    onClick={addTrait}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {character.traits.map((trait, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full"
                  >
                    <span>{trait}</span>
                    <button
                      type="button"
                      onClick={() => removeTrait(index)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Emotions</h3>
                <div className="flex gap-2">
                  <Input
                    value={newEmotion.name}
                    onChange={(e) =>
                      setNewEmotion({ ...newEmotion, name: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600 w-32"
                    placeholder="Name"
                  />
                  <Input
                    value={newEmotion.description}
                    onChange={(e) =>
                      setNewEmotion({
                        ...newEmotion,
                        description: e.target.value,
                      })
                    }
                    className="bg-gray-700 border-gray-600"
                    placeholder="Description"
                  />
                  <Button
                    type="button"
                    onClick={addEmotion}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries(character.emotions).map(
                  ([name, description]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-blue-400">
                          {name}
                        </span>
                        <p className="text-sm text-gray-300">{description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEmotion(name)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  )
                )}
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
                  {editingCharacter ? "Updating..." : "Creating..."}
                </div>
              ) : editingCharacter ? (
                "Update Character"
              ) : (
                "Create Character"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
