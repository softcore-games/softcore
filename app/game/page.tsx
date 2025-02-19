"use client";

import React, { Suspense } from "react";
import { GameView } from "@/components/game/GameView";
import { LoadingView } from "@/components/game/LoadingView";

export default function GamePage() {
  return (
    <Suspense fallback={<LoadingView />}>
      <GameView />
    </Suspense>
  );
}
