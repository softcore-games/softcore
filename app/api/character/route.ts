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

const characterImages = [
  "https://im.runware.ai/image/ii/330a9c93-aa23-4d43-9e15-c0a05d70ae35.WEBP",
  "https://im.runware.ai/image/ii/b254fd6f-1d6f-417c-b1c4-66438200cb83.WEBP",
  "https://im.runware.ai/image/ii/bc2a920f-3cbf-4aa1-8f6e-8fdc2043b275.WEBP",
  "https://im.runware.ai/image/ii/0e55e629-2ee8-4272-b494-6d04431bb613.WEBP",
  "https://im.runware.ai/image/ii/521c11fb-8e3f-4559-aa05-89110e6f70c9.WEBP",
  "https://im.runware.ai/image/ii/b36b09bf-4a4a-4131-8d97-ed49ce016fb3.WEBP",
  "https://im.runware.ai/image/ii/212f427c-07b6-42e0-bafe-ec6a8376c857.WEBP",
  "https://im.runware.ai/image/ii/d3148960-5737-4a7d-9021-6a6e3cfa21a5.WEBP",
  "https://im.runware.ai/image/ii/9e361d10-6000-4528-89ae-2b183e337af7.WEBP",
  "https://im.runware.ai/image/ii/d982b9e0-f730-49b6-8caa-60ac4be825c8.WEBP",
  "https://im.runware.ai/image/ii/02c096f5-5414-4d6e-9fa0-0bdff2b275c3.WEBP",
  "https://im.runware.ai/image/ii/b7ddd6bb-f827-4e4c-a0a3-33877bb04739.WEBP",
  "https://im.runware.ai/image/ii/c0904f22-93b7-4f9a-af2f-f333bea7f5f2.WEBP",
  "https://im.runware.ai/image/ii/13390183-f825-4f34-8308-d0f6b81b4fa3.WEBP",
  "https://im.runware.ai/image/ii/57970026-2d8f-4231-a7f7-ae16cbca3d98.WEBP",
  "https://im.runware.ai/image/ii/83616a54-40de-4d5c-a7a2-6fcb03d87f0a.WEBP",
  "https://im.runware.ai/image/ii/b7662c98-dd8b-4d32-aa1e-ae10842248fb.WEBP",
  "https://im.runware.ai/image/ii/bc1e653b-633d-484a-942c-a634eb0b705f.WEBP",
  "https://im.runware.ai/image/ii/19e11dea-5d83-43c8-a43b-460b6636e0fb.WEBP",
  "https://im.runware.ai/image/ii/50f254c1-a667-4926-9652-5e5461000f83.WEBP",
  "https://im.runware.ai/image/ii/6089cb87-ae92-42c5-9e38-a8328906668b.WEBP",
  "https://im.runware.ai/image/ii/86b1ffb9-0953-45a8-8b59-48a69435b545.WEBP",
  "https://im.runware.ai/image/ii/81f583f4-7123-4cff-b38d-92e0d43e9b0d.WEBP",
  "https://im.runware.ai/image/ii/3a44dfbe-e9c4-46d3-ae6e-7329ea8abec3.WEBP",
  "https://im.runware.ai/image/ii/f8a254e5-b9a6-412c-aeea-e183775cc5a8.WEBP",
  "https://im.runware.ai/image/ii/04970b70-3ace-45c5-86cd-5345b84ff16c.WEBP",
  "https://im.runware.ai/image/ii/3b9cdc69-b464-470a-b56d-b65241ad45b1.WEBP",
];

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

    return characterImages[randomIndex];
  } catch (error) {
    console.error("Image selection error:", error);
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
