import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateInitialScene } from "@/lib/open-ai";
import { generateSceneImage } from "@/lib/fal-ai";

async function createInitialScene(
  characterId: string,
  userId: string,
  character: any
) {
  try {
    // Generate the initial scene content
    const sceneContent = await generateInitialScene(character.name);

    // Generate the scene image
    const imageUrl = await generateSceneImage(
      character.imageUrl,
      sceneContent.title,
      sceneContent.content
    );

    // Create the scene in the database
    const scene = await prisma.scene.create({
      data: {
        title: sceneContent.title,
        content: sceneContent.content,
        imageUrl,
        choices: sceneContent.choices,
        chapter: 1,
        sceneNumber: 1,
        characterId,
        userId,
      },
    });

    return scene;
  } catch (error) {
    console.error("Error creating initial scene:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await req.json();
    if (!characterId) {
      return NextResponse.json(
        { error: "Character ID is required" },
        { status: 400 }
      );
    }

    // Get the character details
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: {
        scenes: {
          where: {
            chapter: 1,
            sceneNumber: 1,
          },
        },
      },
    });

    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    // Start a transaction to update user and create initial scene
    const result = await prisma.$transaction(async (tx) => {
      // Update the selected character
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { selectedCharacterId: characterId },
      });

      // Create initial scene if it doesn't exist
      let initialScene = character.scenes[0];
      if (!initialScene) {
        initialScene = await createInitialScene(
          characterId,
          user.id,
          character
        );
      }

      return { user: updatedUser, scene: initialScene };
    });

    return NextResponse.json({
      success: true,
      user: result.user,
      initialScene: result.scene,
    });
  } catch (error) {
    console.error("Error selecting character:", error);
    return NextResponse.json(
      { error: "Failed to select character" },
      { status: 500 }
    );
  }
}
