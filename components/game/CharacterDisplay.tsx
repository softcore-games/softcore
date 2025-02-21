import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Character } from "@/data/gameData";
import { Scene } from "@/data/gameData";
import Image from "next/image";

interface CharacterDisplayProps {
  currentCharacter: Character;
  currentScene: Scene;
  relationshipScore: number;
  onMintNFT: () => void;
}

export const CharacterDisplay = ({
  currentCharacter,
  currentScene,
  relationshipScore,
  onMintNFT,
}: CharacterDisplayProps) => {
  const getCharacterImage = () => {
    console.log("Current mood:", currentScene?.mood); // Debug mood
    console.log("Available expressions:", currentCharacter.expressions); // Debug expressions

    // First check if there's a scene-specific image
    if (currentScene?.imageURL) {
      console.log("Using scene-specific image:", currentScene.imageURL);
      return currentScene.imageURL;
    }

    // Then check for mood-specific expression
    if (
      currentScene?.mood &&
      currentCharacter.expressions?.[currentScene.mood]
    ) {
      console.log(
        "Using mood-specific image:",
        currentCharacter.expressions[currentScene.mood]
      );
      return currentCharacter.expressions[currentScene.mood];
    }

    // Finally, fall back to the default avatar
    console.log("Using default avatar:", currentCharacter.avatar);
    return currentCharacter.avatar;
  };

  return (
    <motion.div className="md:w-1/3">
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl border border-love-200 dark:border-love-800">
        <div className="p-4 flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentScene?.mood}-${currentScene?.imageURL}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full aspect-[3/4] relative overflow-hidden rounded-lg mb-4"
            >
              <img
                src={getCharacterImage()}
                alt={`${currentCharacter.name} - ${
                  currentScene?.mood || "default"
                }`}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  console.error("Image failed to load:", e);
                  e.currentTarget.src = currentCharacter.avatar; // Fallback to avatar
                }}
              />
            </motion.div>
          </AnimatePresence>

          <h3 className="text-2xl font-semibold bg-gradient-to-r from-love-400 to-love-600 bg-clip-text text-transparent mb-2">
            {currentCharacter.name}
          </h3>

          <div className="flex items-center gap-2 text-love-600 dark:text-love-300 text-lg mb-4">
            <Sparkles className="w-5 h-5" />
            <span>Relationship Score: {relationshipScore}</span>
          </div>

          <Button
            variant="default"
            size="lg"
            className="w-full bg-love-500 hover:bg-love-600 text-white"
            onClick={onMintNFT}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Mint this Moment
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
