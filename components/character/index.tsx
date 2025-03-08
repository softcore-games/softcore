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
    <div className="container mx-auto px-4 py-8">
      {characters.length === 0 ? (
        <div className="text-center mt-8">
          <button
            onClick={generateCharacters}
            disabled={generating}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-black bg-opacity-50 rounded-lg p-4 cursor-pointer transition duration-300 hover:bg-opacity-70 hover:ring-2 hover:ring-pink-500"
              onClick={() => handleCharacterSelect(character.id)}
            >
              <div className="relative h-[400px] mb-4">
                <Image
                  src={character.imageUrl}
                  alt={character.name}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  {character.name}
                </h2>
                <p className="text-gray-300">{character.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
