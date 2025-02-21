import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Character } from "@/data/gameData";
import { toast } from "@/hooks/use-toast";

interface CharacterSelectionProps {
  onSelect: (characterId: string) => void;
}

export const CharacterSelection = ({ onSelect }: CharacterSelectionProps) => {
  const [characters, setCharacters] = useState<Character[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["characters"],
    queryFn: async () => {
      const apiKey = localStorage.getItem("OPENAI_API_KEY");
      if (!apiKey) {
        throw new Error("OpenAI API key is required");
      }

      const response = await fetch("/api/generate-characters", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate characters");
      }

      return response.json();
    },
  });

  useEffect(() => {
    if (data?.characters) {
      setCharacters(data.characters);
      // Store the characters in localStorage for persistence
      localStorage.setItem(
        "generatedCharacters",
        JSON.stringify(data.characters)
      );
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load characters",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleCharacterSelect = (characterId: string) => {
    // Find the selected character's full data
    const selectedCharacter = characters.find(
      (char) => char.id === characterId
    );
    if (selectedCharacter) {
      localStorage.setItem("selectedCharacterId", characterId);
      // Store the selected character's full data
      localStorage.setItem(
        "selectedCharacterData",
        JSON.stringify(selectedCharacter)
      );
      onSelect(characterId);
    } else {
      toast({
        title: "Error",
        description: "Could not find character data",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-love-100">
        <div className="text-2xl text-love-600">Generating characters...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-love-100">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-display text-center mb-8 text-love-900"
        >
          Choose Your Romance
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {characters.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="hover:shadow-xl transition-shadow duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-love-200 dark:border-love-800">
                <CardHeader>
                  <div className="relative w-48 h-48 mx-auto mb-4">
                    <img
                      src={character.avatar}
                      alt={character.name}
                      className="rounded-full w-full h-full object-cover border-4 border-love-300 dark:border-love-700 shadow-lg"
                    />
                  </div>
                  <CardTitle className="text-2xl text-center text-love-800 dark:text-love-100">
                    {character.name}
                  </CardTitle>
                  <CardDescription className="text-center text-love-600 dark:text-love-300">
                    {character.personality}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-center mb-4 text-love-700 dark:text-love-200">
                    {character.background}
                  </p>
                  <Button
                    onClick={() => handleCharacterSelect(character.id)}
                    className="w-full bg-love-500 hover:bg-love-600 text-white"
                  >
                    Choose {character.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
