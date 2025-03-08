import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateInitialScene } from "@/lib/open-ai";
import { generateSceneImage } from "@/lib/fal-ai";

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

    // First, update the selected character
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { selectedCharacterId: characterId },
    });

    // Check if initial scene exists
    let initialScene = character.scenes[0];

    if (!initialScene) {
      // Create a placeholder scene first
      initialScene = await prisma.scene.create({
        data: {
          title: "Generating...",
          content: "Your story is being created...",
          imageUrl: character.imageUrl, // Use character image temporarily
          choices: [],
          chapter: 1,
          sceneNumber: 1,
          characterId,
          userId: user.id,
          status: "GENERATING",
        },
      });

      // Generate the scene content asynchronously
      generateInitialScene(character.name)
        .then(async (sceneContent) => {
          const imageUrl = await generateSceneImage(
            character.imageUrl,
            sceneContent.title,
            sceneContent.content
          );

          await prisma.scene.update({
            where: { id: initialScene.id },
            data: {
              title: sceneContent.title,
              content: sceneContent.content,
              imageUrl,
              choices: sceneContent.choices,
              status: "COMPLETED",
            },
          });
        })
        .catch(async (error) => {
          console.error("Error generating initial scene:", error);
          await prisma.scene.update({
            where: { id: initialScene.id },
            data: { status: "FAILED" },
          });
        });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      initialScene,
    });
  } catch (error) {
    console.error("Error selecting character:", error);
    return NextResponse.json(
      { error: "Failed to select character" },
      { status: 500 }
    );
  }
}
