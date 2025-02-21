"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Character } from "@/data/gameData";
import { Header } from "./Header";
import { WalletConnection } from "./WalletConnection";
import { useRouter } from "next/navigation";
import {
  getStamina,
  decreaseStamina,
  purchaseStamina,
} from "@/utils/staminaSystem";
import { DialogueBox } from "./game/DialogueBox";
import { CharacterDisplay } from "./game/CharacterDisplay";
import { StaminaDisplay } from "./game/StaminaDisplay";

const defaultCharacter: Character = {
  id: "default",
  name: "Anonymous",
  avatar: "/placeholder.svg",
  personality: "Default personality",
  background: "Default background",
};

interface GameState {
  history: {
    id: string;
    message: string;
    choices: Array<{
      id: string;
      text: string;
      nextSceneId: string;
      relationshipImpact: number;
    }>;
    selectedChoice: number | null;
    mood: "happy" | "flirty" | "thoughtful" | "surprised" | "sad";
    imageURL?: string;
    timestamp: number;
  }[];
  currentState: {
    selectedCharacterId: string;
    relationshipScore: number;
  };
}

interface GameSceneProps {
  onLogout?: () => void;
}

interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  relationshipImpact: number;
}

export const GameScene = ({ onLogout }: GameSceneProps) => {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = localStorage.getItem("gameState");
    const selectedCharacterId = localStorage.getItem("selectedCharacterId");
    return savedState
      ? JSON.parse(savedState)
      : {
          history: [],
          currentState: {
            selectedCharacterId: selectedCharacterId || defaultCharacter.id,
            relationshipScore: 0,
          },
        };
  });

  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stamina, setStamina] = useState(() => getStamina());

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [currentCharacter] = useState<Character>(() => {
    const savedCharacterData = localStorage.getItem("selectedCharacterData");
    if (savedCharacterData) {
      return JSON.parse(savedCharacterData);
    }
    return defaultCharacter;
  });

  const currentScene =
    gameState.history[currentIndex] ||
    gameState.history[gameState.history.length - 1];

  const activeProvider = localStorage.getItem("ACTIVE_AI_PROVIDER") || "OPENAI";
  // const apiKey = localStorage.getItem(`${activeProvider}_API_KEY`);

  const isReviewingPastScene = currentIndex < gameState.history.length - 1;

  useEffect(() => {
    if (currentScene && currentScene.message) {
      const messageText = currentScene.message.toString().trim();
      setIsTyping(true);
      setDisplayedText("");
      let index = 0;

      const interval = setInterval(() => {
        if (index < messageText.length) {
          setDisplayedText(messageText.substring(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [currentScene]);

  const { data: initialScene, error: initialError } = useQuery({
    queryKey: ["initialScene"],
    queryFn: async () => {
      if (gameState.history.length > 0) return null;

      const token = localStorage.getItem("token");
      const response = await fetch("/api/generate-scene", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-provider": activeProvider,
          "x-character-id": gameState.currentState.selectedCharacterId,
        },
        body: JSON.stringify({
          currentScene: null,
          selectedChoice: null,
          history: [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/"); // Redirect to login page if unauthorized
          throw new Error("Please log in again");
        }
        throw new Error(data.error || "Failed to generate scene");
      }

      return data;
    },
    enabled: gameState.history.length === 0,
  });

  const {
    data: nextScene,
    isLoading: isNextSceneLoading,
    error: nextError,
  } = useQuery({
    queryKey: ["nextScene", selectedChoice],
    queryFn: async () => {
      const currentStamina = getStamina();
      if (currentStamina <= 0) {
        throw new Error("Not enough stamina! Purchase more to continue.");
      }

      const token = localStorage.getItem("token");
      const remainingStamina = decreaseStamina();
      setStamina(remainingStamina);

      const response = await fetch("/api/generate-scene", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-provider": activeProvider,
          "x-character-id": gameState.currentState.selectedCharacterId,
        },
        body: JSON.stringify({
          currentScene,
          selectedChoice: currentScene?.choices[selectedChoice ?? 0]?.text,
          history: gameState.history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/"); // Redirect to login page if unauthorized
          throw new Error("Please log in again");
        }
        throw new Error(data.error || "Failed to generate scene");
      }

      return data;
    },
    enabled: selectedChoice !== null,
  });

  useEffect(() => {
    if (initialError || nextError) {
      console.error("Query error:", initialError || nextError);
      toast({
        title: "Error",
        description:
          (initialError || nextError)?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [initialError, nextError]);

  useEffect(() => {
    // if (!apiKey) {
    //   toast({
    //     title: "API Key Required",
    //     description: `Please set your ${activeProvider} API key in the settings page`,
    //     variant: "destructive",
    //   });
    // }
  }, [activeProvider]);

  useEffect(() => {
    if (initialScene && gameState.history.length === 0) {
      const messageText = initialScene.message?.toString() || "";
      const newGameState = {
        ...gameState,
        history: [
          {
            ...initialScene,
            id: `scene_${gameState.history.length}`,
            selectedChoice: null,
            timestamp: Date.now(),
            message: messageText,
            imageURL: initialScene.imageURL,
            choices: initialScene.choices.map((choice: Choice) => ({
              id: choice.id,
              text: choice.text,
              nextSceneId: choice.nextSceneId,
              relationshipImpact: choice.relationshipImpact || 0,
            })),
          },
        ],
      };
      setGameState(newGameState);
      localStorage.setItem("gameState", JSON.stringify(newGameState));
    }
  }, [initialScene, gameState]);

  useEffect(() => {
    if (nextScene && selectedChoice !== null) {
      const messageText = nextScene.message?.toString() || "";
      const newGameState = {
        ...gameState,
        history: [
          ...gameState.history,
          {
            ...nextScene,
            id: `scene_${gameState.history.length}`,
            selectedChoice,
            timestamp: Date.now(),
            message: messageText,
            imageURL: nextScene.imageURL,
            choices: nextScene.choices.map((choice: Choice) => ({
              id: choice.id,
              text: choice.text,
              nextSceneId: choice.nextSceneId,
              relationshipImpact: choice.relationshipImpact || 0,
            })),
          },
        ],
        currentState: {
          ...gameState.currentState,
          relationshipScore:
            gameState.currentState.relationshipScore +
            (currentScene?.choices[selectedChoice]?.relationshipImpact || 0),
        },
      };
      setGameState(newGameState);
      setSelectedChoice(null);
      localStorage.setItem("gameState", JSON.stringify(newGameState));
    }
  }, [nextScene, selectedChoice, gameState, currentScene?.choices]);

  const handleChoiceSelect = (choiceIndex: number) => {
    if (isTyping) {
      setDisplayedText(currentScene.message);
      setIsTyping(false);
      return;
    }
    setSelectedChoice(choiceIndex);
  };

  const handleSave = () => {
    const blob = new Blob([JSON.stringify(gameState, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `visual-novel-save-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Game Saved",
      description: "Your progress has been saved to a file",
    });
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const loadedState = JSON.parse(content);
        setGameState(loadedState);
        localStorage.setItem("gameState", content);

        toast({
          title: "Game Loaded",
          description: "Your save file has been loaded successfully",
        });
      } catch (error) {
        toast({
          title: "Error Loading Save",
          description: "The save file appears to be invalid or corrupted",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleMintNFT = async () => {
    try {
      const address = localStorage.getItem("walletAddress");

      if (!address) {
        toast({
          title: "Wallet Required",
          description: "Please connect your Core DAO wallet first",
          variant: "destructive",
        });
        return;
      }

      const metadata = {
        title: currentScene.message.split(/[.!?]/)[0],
        description: currentScene.message,
        character: currentCharacter.name,
        mood: currentScene.mood,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch("/api/mint-nft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentScene.id,
          imageUrl: currentScene.imageURL || currentCharacter.avatar,
          characterName: currentCharacter.name,
          metadata,
          walletAddress: address,
        }),
      });

      const data = await response.json();

      if (data.error) throw data.error;

      toast({
        title: "Success!",
        description: "Your scene has been minted as an NFT. Check your wallet!",
      });

      window.open(`https://scan.coredao.org/tx/${data.transaction}`, "_blank");
    } catch (error) {
      console.error("NFT minting error:", error);
      toast({
        title: "Minting Failed",
        description: "Failed to mint the NFT. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePurchaseStamina = () => {
    purchaseStamina(5);
    setStamina(getStamina());
    toast({
      title: "Stamina Purchased!",
      description: "You've received 5 more prompts.",
    });
  };

  const handleGoBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      const previousScene = gameState.history[currentIndex - 1];
      setDisplayedText(previousScene.message);
      setSelectedChoice(null);

      toast({
        title: "Previous Scene",
        description: "Viewing previous scene",
      });
    }
  };

  const handleGoForward = () => {
    if (currentIndex < gameState.history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      const nextScene = gameState.history[currentIndex + 1];
      setDisplayedText(nextScene.message);
      setSelectedChoice(null);

      toast({
        title: "Next Scene",
        description: "Viewing next scene",
      });
    }
  };

  useEffect(() => {
    setCurrentIndex(gameState.history.length - 1);
  }, [gameState.history.length]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space" && isTyping) {
        event.preventDefault();
        setDisplayedText(currentScene.message?.toString() || "");
        setIsTyping(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isTyping, currentScene]);

  const handleLogout = () => {
    // The actual logout logic is now handled in the Header component
    if (onLogout) {
      onLogout();
    }
  };

  if (!currentScene) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-love-100 to-love-200 dark:from-love-900 dark:to-love-800">
        <div className="text-2xl text-love-800 dark:text-love-200 bg-white/20 dark:bg-black/20 backdrop-blur-lg px-6 py-3 rounded-lg">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-love-100 to-love-200 dark:from-love-900 dark:to-love-800">
      <Header
        onLogout={handleLogout}
        onSave={handleSave}
        onLoad={() => fileInputRef.current?.click()}
      >
        <StaminaDisplay stamina={stamina} onPurchase={handlePurchaseStamina} />
        <WalletConnection />
      </Header>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleLoad}
        accept=".json"
        className="hidden"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <DialogueBox
              currentScene={currentScene}
              displayedText={displayedText}
              isTyping={isTyping}
              selectedChoice={selectedChoice}
              onChoiceSelect={handleChoiceSelect}
              isNextSceneLoading={isNextSceneLoading}
              isReviewingPastScene={isReviewingPastScene}
              onBack={handleGoBack}
              onForward={handleGoForward}
              canGoBack={currentIndex > 0}
              canGoForward={currentIndex < gameState.history.length - 1}
            />

            <CharacterDisplay
              currentCharacter={currentCharacter}
              currentScene={currentScene}
              relationshipScore={gameState.currentState.relationshipScore}
              onMintNFT={handleMintNFT}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
