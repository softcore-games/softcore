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

    // Check if requested scene already exists
    const existingScene = await prisma.scene.findUnique({
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
      return NextResponse.json({
        success: true,
        scene: existingScene,
        chapter: currentChapter,
      });
    }

    // Generate single scene
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

    const newScene = await prisma.scene.create({
      data: {
        title: sceneContent.title,
        content: sceneContent.content,
        imageUrl,
        choices: sceneContent.choices,
        chapter: currentChapter,
        characterId: character.id,
        userId: user.id,
        sceneNumber: sceneNumber || 1,
      },
    });

    return NextResponse.json({
      success: true,
      scene: newScene,
      chapter: currentChapter,
    });
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
