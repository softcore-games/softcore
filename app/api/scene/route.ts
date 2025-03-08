import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { generateSceneContent } from "@/lib/open-ai";
import { generateSceneImage } from "@/lib/fal-ai";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { characterId, sceneNumber, previousChoice } = await req.json();

    // Start a transaction to handle concurrent requests
    const result = await prisma.$transaction(async (tx) => {
      // Lock the character record for atomic operations
      const character = await tx.character.findUnique({
        where: { id: characterId },
        include: {
          scenes: {
            orderBy: [{ chapter: "desc" }, { sceneNumber: "desc" }],
            take: 1,
          },
        },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      // Calculate current chapter
      const lastScene = character.scenes[0];
      const currentChapter = lastScene
        ? lastScene.sceneNumber === 10
          ? lastScene.chapter + 1
          : lastScene.chapter
        : 1;

      // Check for existing scene with FOR UPDATE lock
      const existingScene = await tx.scene.findUnique({
        where: {
          characterId_chapter_sceneNumber: {
            characterId: character.id,
            chapter: currentChapter,
            sceneNumber: sceneNumber || 1,
          },
        },
        include: {
          userChoices: {
            where: { userId: user.id },
          },
        },
      });

      if (existingScene) {
        if (existingScene.status === "COMPLETED") {
          return { scene: existingScene, chapter: currentChapter };
        } else if (existingScene.status === "GENERATING") {
          // Wait and retry if scene is still generating
          throw new Error("Scene generation in progress");
        }
      }

      // Create a placeholder scene with GENERATING status
      const placeholderScene = await tx.scene.create({
        data: {
          title: "Generating...",
          content: "Please wait while your scene is being generated...",
          imageUrl: "",
          choices: [],
          chapter: currentChapter,
          characterId: character.id,
          userId: user.id,
          sceneNumber: sceneNumber || 1,
          status: "GENERATING",
        },
      });

      return { placeholderScene, character, currentChapter };
    });

    // If we got an existing completed scene, return it
    if ("scene" in result) {
      return NextResponse.json({
        success: true,
        scene: result.scene,
        chapter: result.chapter,
      });
    }

    // Generate scene content and image asynchronously
    const { placeholderScene, character, currentChapter } = result;

    try {
      const sceneContent = await generateSceneContent(
        character.name,
        currentChapter,
        sceneNumber || 1,
        previousChoice
      );

      const imageUrl = await generateSceneImage(
        character.imageUrl,
        sceneContent.title,
        sceneContent.content
      );

      // Update the placeholder scene with actual content
      const completedScene = await prisma.scene.update({
        where: { id: placeholderScene.id },
        data: {
          title: sceneContent.title,
          content: sceneContent.content,
          imageUrl,
          choices: sceneContent.choices,
          status: "COMPLETED",
        },
      });

      return NextResponse.json({
        success: true,
        scene: completedScene,
        chapter: currentChapter,
      });
    } catch (error) {
      // Mark the scene as failed if generation fails
      await prisma.scene.update({
        where: { id: placeholderScene.id },
        data: { status: "FAILED" },
      });
      throw error;
    }
  } catch (error) {
    console.error("Error generating scene:", error);
    return NextResponse.json(
      { error: "Failed to generate scene" },
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

    // If sceneId is provided, fetch single scene
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

    // If no sceneId, then characterId is required for fetching multiple scenes
    if (!characterId) {
      return NextResponse.json(
        { error: "Character ID required when scene ID is not provided" },
        { status: 400 }
      );
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
