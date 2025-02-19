import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

interface Choice {
  text: string;
  action: () => void;
}

interface ChoiceMenuProps {
  choices: Choice[];
}

export function ChoiceMenu({ choices }: ChoiceMenuProps) {
  const addChoice = useGameStore((state) => state.addChoice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                 bg-black/90 p-6 rounded-lg min-w-[300px] z-30"
    >
      <div className="space-y-4">
        {choices.map((choice, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full px-6 py-3 text-white bg-gray-800 hover:bg-gray-700
                     rounded-lg transition-colors text-left"
            onClick={() => {
              addChoice(choice.text);
              choice.action();
            }}
          >
            {choice.text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
