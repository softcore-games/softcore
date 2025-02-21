"use client";
import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { LoginScreen } from "@/components/LoginScreen";
import { GameScene } from "@/components/GameScene";
import { CharacterSelection } from "@/components/CharacterSelection";
import { AgeConsentPopup } from "@/components/AgeConsentPopup";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const Home = () => {
  // Initialize all states with default values
  const [isLoaded, setIsLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );
  const [hasAgeConsent, setHasAgeConsent] = useState(false);
  const [gameState, setGameState] = useState({
    history: [],
    currentState: {
      selectedCharacterId: "",
      relationshipScore: 0,
    },
  });
  const [activeProvider, setActiveProvider] = useState("OPENAI");
  const [apiKey, setApiKey] = useState<string | null>(null);

  const router = useRouter();

  // Load all localStorage values after component mounts
  useEffect(() => {
    // Load basic game state
    setStarted(localStorage.getItem("game_started") === "true");
    setIsLoggedIn(localStorage.getItem("user") !== null);
    setHasAgeConsent(localStorage.getItem("age-consent") === "true");
    setSelectedCharacter(localStorage.getItem("selectedCharacterId"));

    // Load game state
    const savedState = localStorage.getItem("gameState");
    if (savedState) {
      setGameState(JSON.parse(savedState));
    }

    // Load provider settings
    const provider = localStorage.getItem("ACTIVE_AI_PROVIDER") || "OPENAI";
    setActiveProvider(provider);
    setApiKey(localStorage.getItem(`${provider}_API_KEY`));

    setIsLoaded(true);
  }, []);

  // Update localStorage when states change
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("game_started", started.toString());
  }, [started, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (selectedCharacter) {
      localStorage.setItem("selectedCharacterId", selectedCharacter);
    }
  }, [selectedCharacter, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (hasAgeConsent) {
      localStorage.setItem("age-consent", "true");
    }
  }, [hasAgeConsent, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    // if (started && isLoggedIn && !selectedCharacter && !apiKey) {
    //   toast({
    //     title: "API Key Required",
    //     description:
    //       "Please set your OpenAI API key in the settings page before selecting a character.",
    //     variant: "destructive",
    //   });
    //   router.push("/settings");
    // }
  }, [started, isLoggedIn, selectedCharacter, apiKey, router, isLoaded]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStarted(false);
    setSelectedCharacter(null);
    // Clear relevant localStorage items
    localStorage.removeItem("user");
    localStorage.removeItem("game_started");
    localStorage.removeItem("selectedCharacterId");
    localStorage.removeItem("gameState");
  };

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  if (!hasAgeConsent) {
    return (
      <>
        <AgeConsentPopup onConsent={() => setHasAgeConsent(true)} />
        <div className="fixed inset-0 bg-black/80" />
      </>
    );
  }

  if (!started) {
    return <WelcomeScreen onStart={() => setStarted(true)} />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  if (!selectedCharacter && !apiKey) {
    return null;
  }

  if (!selectedCharacter) {
    return <CharacterSelection onSelect={setSelectedCharacter} />;
  }

  return <GameScene onLogout={handleLogout} />;
};

export default Home;
