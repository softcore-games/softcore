"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Wallet } from "lucide-react";
import { useWallet } from "@/lib/hooks/useWallet";

export default function Home() {
  const { account, isConnectedToCore, connectWallet, switchToCore } = useWallet();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-accent">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              SoftCore
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Embark on an immersive journey where your choices shape the story, powered by blockchain and AI.
            </p>
          </div>

          {/* Main Game Card */}
          <Card className="w-full max-w-4xl p-6 backdrop-blur-sm bg-card/90">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80"
                alt="Game Scene"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Game Controls */}
            <div className="mt-6 space-y-4">
              {!account ? (
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={connectWallet}
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Core Wallet
                </Button>
              ) : !isConnectedToCore ? (
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={switchToCore}
                >
                  Switch to Core Network
                </Button>
              ) : (
                <div className="space-y-4">
                  <Button 
                    size="lg" 
                    className="w-full"
                    variant="secondary"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Start New Game
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline">Continue Game</Button>
                    <Button variant="outline">Premium Features</Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <FeatureCard 
              title="AI-Powered Characters"
              description="Interact with dynamic characters powered by advanced AI"
            />
            <FeatureCard 
              title="NFT Collectibles"
              description="Own unique characters and items as NFTs"
            />
            <FeatureCard 
              title="Dynamic Story"
              description="Your choices shape the narrative and outcomes"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="p-4 backdrop-blur-sm bg-card/90">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}