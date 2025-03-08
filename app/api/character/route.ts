import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { generateCharacterProfile } from "@/lib/open-ai";
import fs from "fs";
import path from "path";

// Function to get all image URLs from the public folder
function getCharacterImages(): string[] {
  const publicFolder = path.join(process.cwd(), "public", "images", "model");
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  try {
    const files = fs.readdirSync(publicFolder);
    return files
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map((file) => `${baseUrl}/images/model/${file}`);
  } catch (error) {
    console.error("Error reading character images directory:", error);
    return [];
  }
}

const characterImages = getCharacterImages();

// Keep track of used images to avoid duplicates
let usedImageIndexes = new Set();

async function generateCharacterImage() {
  try {
    // Reset used images if all have been used
    if (usedImageIndexes.size >= characterImages.length) {
      usedImageIndexes.clear();
    }

    // Find an unused random image
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * characterImages.length);
    } while (usedImageIndexes.has(randomIndex));

    // Mark this image as used
    usedImageIndexes.add(randomIndex);

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.softcore.games";
    return (
      characterImages[randomIndex] || `${baseUrl}/images/model/default.jpg`
    );
  } catch (error) {
    console.error("Image selection error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.softcore.games";
    return `${baseUrl}/images/model/default.jpg`; // Make sure to have a default image
  }
}

export async function POST() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingCharacters = await prisma.character.findMany({
      where: { userId: user.id },
    });

    if (existingCharacters.length > 0) {
      return NextResponse.json(
        { error: "Characters already exist" },
        { status: 400 }
      );
    }

    // Keep track of used names
    const usedNames = new Set();
    const charactersToCreate = [];

    // Generate 3 unique characters
    while (charactersToCreate.length < 3) {
      const profile = await generateCharacterProfile();

      // Skip if name already used
      if (usedNames.has(profile.name)) {
        continue;
      }

      const imageUrl = await generateCharacterImage();

      usedNames.add(profile.name);
      charactersToCreate.push({
        name: profile.name,
        imageUrl,
        description: profile.description,
        userId: user.id,
      });
    }

    // Create all characters in the database
    const createdCharacters = await Promise.all(
      charactersToCreate.map((characterData) =>
        prisma.character.create({
          data: characterData,
        })
      )
    );

    return NextResponse.json(
      { characters: createdCharacters },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the characterId from the URL if it exists
    const { searchParams } = new URL(request.url);
    const characterId = searchParams.get("characterId");

    if (characterId) {
      // Fetch specific character
      const character = await prisma.character.findUnique({
        where: {
          id: characterId,
          userId: user.id,
        },
      });

      if (!character) {
        return NextResponse.json(
          { error: "Character not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ character });
    }

    // Fetch all characters for the user
    const characters = await prisma.character.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ characters });
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { error: "Failed to fetch characters" },
      { status: 500 }
    );
  }
}
