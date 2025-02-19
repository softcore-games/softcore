"use client";
import React from "react";
import { useGameState } from "@/hooks/useGameState";
import { GameView } from "@/components/game/GameView";

export default function GamePage() {
  const gameState = useGameState();
  return <GameView {...gameState} />;
}
