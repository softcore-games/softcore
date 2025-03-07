import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

async function generateCharacterProfile() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a character generator for an adult dating simulation game. Create unique, interesting female characters with diverse backgrounds. Return the response as a JSON object containing 'name' and 'description' fields.",
        },
        {
          role: "user",
          content:
            "Generate a character profile as a JSON object. Include a full name and a description (2-3 sentences about personality and background).",
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const profile = JSON.parse(content);

    if (!profile.name || !profile.description) {
      throw new Error("Invalid profile structure received from OpenAI");
    }

    return profile;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    const fallbackProfiles = [
      {
        name: "Sofia Rodriguez",
        description:
          "A passionate flamenco dancer who moved to the city to open her own dance studio. Her fiery personality and artistic soul draw others to her, though she keeps her troubled past carefully hidden.",
      },
      {
        name: "Emma Chen",
        description:
          "A brilliant tech entrepreneur running a successful AI startup. Despite her professional success, she secretly longs for genuine connections beyond the digital world she inhabits.",
      },
      {
        name: "Zara Mitchell",
        description:
          "An adventurous travel photographer with a popular social media following. Her free spirit and wanderlust mask a desire to find someone worth staying in one place for.",
      },
      {
        name: "Isabella Kumar",
        description:
          "A talented fusion chef combining her Indian heritage with modern cuisine. Her experimental nature extends beyond the kitchen, though she struggles to find someone who can keep up with her creative energy.",
      },
      {
        name: "Alexandra Petrova",
        description:
          "A former ballet dancer turned successful nightclub owner. Behind her sophisticated exterior lies a rebellious spirit who loves breaking society's expectations.",
      },
    ];

    return fallbackProfiles[
      Math.floor(Math.random() * fallbackProfiles.length)
    ];
  }
}

async function generateCharacterImage() {
  try {
    const response = await fetch(
      `https://api.night-api.com/images/nsfw/hentai`,
      {
        headers: {
          Authorization: `${process.env.NIGHT_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Generated character image:", data);

    if (!data?.content?.url) {
      throw new Error("Invalid response format from image API");
    }

    return data.content.url;
  } catch (error) {
    console.error("Image API Error:", error);
    return "https://placehold.co/600x800/pink/white?text=Character+Image";
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
