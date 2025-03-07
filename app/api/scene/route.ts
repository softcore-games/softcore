import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

async function generateSceneImage() {
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
    if (!data?.content?.url) {
      throw new Error("Invalid response format from image API");
    }

    return data.content.url;
  } catch (error) {
    console.error("Image API Error:", error);
    return "https://placehold.co/600x800/pink/white?text=Scene+Image";
  }
}

async function generateSceneContent(
  characterName: string,
  chapter: number,
  sceneNumber: number
) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are generating romantic visual novel scenes. Create engaging, flirtatious dialogue suitable for an adult dating simulation. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `Generate a scene for character ${characterName} in Chapter ${chapter}, Scene ${sceneNumber} with the following JSON structure:
          {
            "title": "Scene title",
            "content": "Character's dialogue (2-3 sentences)",
            "choices": ["Flirty response", "Romantic response", "Playful response"]
          }`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return {
      title: `Chapter ${chapter} - Scene ${sceneNumber}`,
      content:
        "The character gazes at you with a warm smile, creating a moment of intimate connection.",
      choices: [
        "Tell them they look beautiful",
        "Share a gentle compliment",
        "Express your feelings",
      ],
    };
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await req.json();

    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: {
        scenes: {
          orderBy: [{ chapter: "desc" }, { sceneNumber: "desc" }],
          take: 1,
        },
      },
    });

    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    // Calculate current chapter
    const lastScene = character.scenes[0];
    const currentChapter = lastScene
      ? lastScene.sceneNumber === 10
        ? lastScene.chapter + 1
        : lastScene.chapter
      : 1;

    // Check for existing complete chapter
    const existingScenes = await prisma.scene.findMany({
      where: {
        characterId: character.id,
        chapter: currentChapter,
      },
      orderBy: { sceneNumber: "asc" },
      include: {
        userChoices: {
          where: { userId: user.id },
        },
      },
    });

    // Return existing chapter if complete
    if (existingScenes.length === 10) {
      return NextResponse.json({
        success: true,
        scenes: existingScenes,
        chapter: currentChapter,
      });
    }

    // Delete incomplete chapter if exists
    if (existingScenes.length > 0) {
      await prisma.scene.deleteMany({
        where: {
          characterId: character.id,
          chapter: currentChapter,
        },
      });
    }

    // Pre-generate all content before transaction
    const sceneDataToCreate = await Promise.all(
      Array.from({ length: 10 }, async (_, i) => {
        const sceneNumber = i + 1;
        const sceneContent = await generateSceneContent(
          character.name,
          currentChapter,
          sceneNumber
        );
        const imageUrl = await generateSceneImage();

        return {
          title: sceneContent.title,
          content: sceneContent.content,
          imageUrl,
          choices: sceneContent.choices,
          chapter: currentChapter,
          characterId: character.id,
          userId: user.id,
          sceneNumber,
        };
      })
    );

    // Create scenes sequentially instead of in a transaction
    const newScenes = [];
    for (const sceneData of sceneDataToCreate) {
      const scene = await prisma.scene.create({
        data: sceneData,
      });
      newScenes.push(scene);
    }

    return NextResponse.json({
      success: true,
      scenes: newScenes,
      chapter: currentChapter,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const characterId = url.searchParams.get("characterId");
    const sceneId = url.searchParams.get("sceneId");
    const chapter = url.searchParams.get("chapter");

    if (!characterId) {
      return NextResponse.json(
        { error: "Character ID required" },
        { status: 400 }
      );
    }

    if (sceneId) {
      const scene = await prisma.scene.findUnique({
        where: { id: sceneId },
        include: {
          userChoices: {
            where: { userId: user.id },
          },
        },
      });

      if (!scene) {
        return NextResponse.json({ error: "Scene not found" }, { status: 404 });
      }

      return NextResponse.json({ scene });
    }

    const whereClause = {
      characterId,
      ...(chapter ? { chapter: parseInt(chapter) } : {}),
    };

    const scenes = await prisma.scene.findMany({
      where: whereClause,
      include: {
        userChoices: {
          where: { userId: user.id },
        },
      },
      orderBy: [{ chapter: "asc" }, { sceneNumber: "asc" }],
    });

    return NextResponse.json({ scenes });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
