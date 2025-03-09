"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Character } from "@/types/game";
import Loading from "@/components/loading";

export default function CharacterSelection() {
  const { user } = useAuth();
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const checkExistingCharacter = async () => {
      try {
        if (user?.selectedCharacterId) {
          window.location.href = `/game/${user.selectedCharacterId}`;
          return;
        }
        setInitialLoading(false);
      } catch (error) {
        console.error("Error checking character:", error);
        setInitialLoading(false);
      }
    };

    checkExistingCharacter();
  }, [user, router]);

  useEffect(() => {
    if (!initialLoading) {
      fetchCharacters();
    }
  }, [initialLoading]);

  const fetchCharacters = async () => {
    try {
      const response = await fetch("/api/character");
      const data = await response.json();

      setCharacters(data.characters);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching characters:", error);
      setLoading(false);
    }
  };

  const handleCharacterSelect = async (characterId: string) => {
    const character = characters.find((c) => c.id === characterId);
    if (!character) return;

    try {
      const response = await fetch("/api/character/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId }),
      });

      if (!response.ok) {
        throw new Error("Failed to select character");
      }

      const data = await response.json();
      if (data.success) {
        router.push(`/game/${characterId}`);
      }
    } catch (error) {
      console.error("Error selecting character:", error);
    }
  };

  const generateCharacters = async () => {
    try {
      setGenerating(true);
      const response = await fetch("/api/character", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate characters");
      }

      const data = await response.json();

      setCharacters(data.characters);
    } catch (error) {
      console.error("Error generating characters:", error);
    } finally {
      setGenerating(false);
    }
  };

  if (initialLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4  max-w-7xl">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-white">
        Choose Your Romance
      </h1>

      {characters.length === 0 ? (
        <div className="text-center mt-8 bg-black/30 backdrop-blur-none p-10 rounded-xl max-w-md mx-auto">
          <button
            onClick={generateCharacters}
            disabled={generating}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {generating ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Characters"
            )}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-black/40 backdrop-blur-sm rounded-xl p-6 transition duration-300 hover:bg-black/60 hover:shadow-xl group relative overflow-hidden border border-gray-800 hover:border-pink-500/50"
              onClick={() => handleCharacterSelect(character.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative rounded-full h-[180px] w-[180px] sm:h-[200px] sm:w-[200px] md:h-[220px] md:w-[220px] mb-6 mx-auto overflow-hidden border-4 border-pink-500/30 group-hover:border-pink-500 transition-all duration-300 shadow-lg">
                <Image
                  src={character.imageUrl}
                  alt={character.name}
                  fill
                  className="object-cover rounded-full transform group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>

              <div className="space-y-4 relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                  {character.name}
                </h2>
                <div className="h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-transparent">
                  <p className="text-gray-300 text-center px-2">
                    {character.description}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent div's onClick
                    handleCharacterSelect(character.id);
                  }}
                  className="mx-auto block w-3/4 py-3 bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white font-semibold rounded-lg transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Let&apos;s Date!
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        /* Custom scrollbar styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 10px;
          border: 2px solid #f1f1f1;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
