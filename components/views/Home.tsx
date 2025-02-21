"use client";
import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { LoginScreen } from "@/components/LoginScreen";
import { GameScene } from "@/components/GameScene";
import { CharacterSelection } from "@/components/CharacterSelection";
import { AgeConsentPopup } from "@/components/AgeConsentPopup";
import { useRouteProtection } from "@/hooks/useRouteProtection";

const Home = () => {
  const { isAuthenticated, setIsAuthenticated } = useRouteProtection();
  const [isLoaded, setIsLoaded] = useState(false);
  const [started, setStarted] = useState(false);
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

  // Load all localStorage values after component mounts
  useEffect(() => {
    setStarted(localStorage.getItem("game_started") === "true");
    setHasAgeConsent(localStorage.getItem("age-consent") === "true");
    setSelectedCharacter(localStorage.getItem("selectedCharacterId"));

    const savedState = localStorage.getItem("gameState");
    if (savedState) {
      setGameState(JSON.parse(savedState));
    }

    const provider = localStorage.getItem("ACTIVE_AI_PROVIDER") || "OPENAI";
    setActiveProvider(provider);

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

  const handleLogout = () => {
    setStarted(false);
    setSelectedCharacter(null);
    localStorage.removeItem("game_started");
    localStorage.removeItem("selectedCharacterId");
    localStorage.removeItem("gameState");
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setStarted(true);
  };

  if (!isLoaded || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-love-800">Loading...</div>
      </div>
    );
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

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (!selectedCharacter) {
    return <CharacterSelection onSelect={setSelectedCharacter} />;
  }

  return <GameScene onLogout={handleLogout} />;
};

export default Home;
