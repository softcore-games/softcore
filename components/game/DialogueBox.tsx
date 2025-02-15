'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface DialogueBoxProps {
  text: string;
  speaker?: string;
  onComplete?: () => void;
}

export function DialogueBox({ text, speaker, onComplete }: DialogueBoxProps) {
  const { settings } = useGameStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const textSpeed = {
      slow: 100,
      normal: 50,
      fast: 25,
    }[settings.textSpeed];

    if (displayedText.length < text.length) {
      timeoutId = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, textSpeed);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, text, settings.textSpeed, isComplete, onComplete]);

  const handleClick = () => {
    if (displayedText.length < text.length) {
      // Show all text immediately when clicked
      setDisplayedText(text);
      setIsComplete(true);
      onComplete?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-black/80 text-white p-6 min-h-[200px] cursor-pointer"
      onClick={handleClick}
    >
      {speaker && (
        <h3 className="text-xl font-bold mb-2 text-blue-400">{speaker}</h3>
      )}
      <AnimatePresence mode="wait">
        <motion.p
          key={text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg leading-relaxed"
        >
          {displayedText}
        </motion.p>
      </AnimatePresence>
      
      {isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 right-4 text-white/60"
        >
          Click to continue...
        </motion.div>
      )}
    </motion.div>
  );
}