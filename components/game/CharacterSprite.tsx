import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface CharacterSpriteProps {
  name: string;
  emotion: string;
  imageUrl?: string | null;
  position?: "left" | "center" | "right";
  speaking?: boolean;
}

export function CharacterSprite({
  name,
  emotion,
  imageUrl,
  position = "center",
  speaking = false,
}: CharacterSpriteProps) {
  const positionStyles = {
    left: "left-0",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0",
  };

  if (!imageUrl) return null;

  return (
    <motion.div
      className={`absolute bottom-[200px] ${positionStyles[position]} z-20`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: speaking ? -10 : 0,
      }}
      transition={{
        y: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
    >
      <Image
        src={imageUrl}
        alt={`${name} - ${emotion}`}
        width={400}
        height={600}
        className="pointer-events-none"
        priority
      />
    </motion.div>
  );
}
