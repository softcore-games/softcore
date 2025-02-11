"use client";

import { WalletStatus } from "@/components/wallet-status";
import { GameContainer } from "@/components/game-container";
import { useState } from "react";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-accent">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SoftCore
          </h1>
          <WalletStatus onConnectedChange={setIsConnected} />
        </header>
        
        <GameContainer isWalletConnected={isConnected} />
      </div>
    </main>
  );
}