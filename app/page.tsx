'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Wallet, Gamepad2, Crown, Sparkles, History } from 'lucide-react';
import { useWallet } from '@/lib/hooks/useWallet';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

export default function Home() {
  const router = useRouter();
  const { account, isConnectedToCore, connectWallet, switchToCore, error } = useWallet();
  const [showTutorial, setShowTutorial] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const startNewGame = async () => {
    setIsLoading(true);
    // Simulate loading assets
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push('/game');
  };

  const continueGame = async () => {
    setIsLoading(true);
    // Load saved progress
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push('/game');
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-accent">
      {/* Animated background particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-96 w-96 animate-pulse rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-48 -right-48 h-96 w-96 animate-pulse rounded-full bg-accent/5 blur-3xl delay-700" />
      </div>

      <div className="container relative mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Hero Section */}
          <div className="max-w-3xl space-y-4 text-center">
            <h1 className="animate-gradient bg-gradient-to-r from-primary via-accent-foreground to-primary bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
              SoftCore
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Embark on an immersive journey where your choices shape the story, powered by
              blockchain and AI.
            </p>
          </div>

          {/* Main Game Card */}
          <Card className="w-full max-w-4xl border-2 border-accent/20 bg-card/90 p-6 backdrop-blur-sm">
            <div className="group relative aspect-video overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80"
                alt="Game Scene"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="mb-2 text-2xl font-bold">Chapter 1: The Digital Awakening</h2>
                <p className="text-sm opacity-90">
                  Begin your journey in a world where reality and digital realms intertwine.
                </p>
              </div>
            </div>

            {/* Game Controls */}
            <div className="mt-6 space-y-4">
              {error && (
                <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-800 dark:bg-red-900/50 dark:text-red-200">
                  {error}
                </div>
              )}

              {!account ? (
                <Button
                  size="lg"
                  className="group relative w-full overflow-hidden"
                  onClick={connectWallet}
                >
                  <div className="animate-gradient-x absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Core Wallet
                </Button>
              ) : !isConnectedToCore ? (
                <Button size="lg" className="w-full" onClick={switchToCore}>
                  Switch to Core Network
                </Button>
              ) : (
                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    onClick={() => setShowTutorial(true)}
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Start New Game
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={continueGame}>
                      <History className="mr-2 h-5 w-5" />
                      Continue Game
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/premium')}>
                      <Crown className="mr-2 h-5 w-5" />
                      Premium Features
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Features Grid */}
          <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-primary" />}
              title="AI-Powered Characters"
              description="Interact with dynamic characters powered by advanced AI"
            />
            <FeatureCard
              icon={<Crown className="h-8 w-8 text-primary" />}
              title="NFT Collectibles"
              description="Own unique characters and items as NFTs"
            />
            <FeatureCard
              icon={<Gamepad2 className="h-8 w-8 text-primary" />}
              title="Dynamic Story"
              description="Your choices shape the narrative and outcomes"
            />
          </div>
        </div>
      </div>

      {/* Tutorial Dialog */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to SoftCore</DialogTitle>
            <DialogDescription>
              Before you begin your journey, here's a quick guide to get you started.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">🎮 Basic Controls</h3>
              <p className="text-sm text-muted-foreground">
                Click or tap choices to progress through the story. Your decisions matter!
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">💬 Character Interactions</h3>
              <p className="text-sm text-muted-foreground">
                Chat with AI characters and build relationships that affect the story.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">🏆 NFTs & Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Collect NFTs to unlock special content and character interactions.
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setShowTutorial(false);
                startNewGame();
              }}
            >
              Begin Adventure
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 p-6">
            <h3 className="text-center text-lg font-semibold">Loading Your Adventure</h3>
            <Progress value={loadingProgress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">
              Preparing your journey into the digital realm...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="group border-2 border-accent/20 bg-card/90 p-6 backdrop-blur-sm transition-colors hover:border-accent/40">
      <div className="space-y-2">
        <div className="w-fit rounded-lg bg-accent/10 p-2 transition-colors group-hover:bg-accent/20">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
