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

    // Update the selected character
    await prisma.user.update({
      where: { id: user.id },
      data: { selectedCharacterId: characterId },
    });

    // Check if initial scene exists
    let initialScene = character.scenes[0];

    if (!initialScene) {
      // Generate scene content synchronously
      const sceneContent = await generateInitialScene(character.name);
      const imageUrl = await generateSceneImage(
        character.imageUrl,
        sceneContent.title,
        sceneContent.content
      );

      // Create the scene
      initialScene = await prisma.scene.create({
        data: {
          title: sceneContent.title,
          content: sceneContent.content,
          imageUrl,
          choices: sceneContent.choices,
          chapter: 1,
          sceneNumber: 1,
          characterId,
          userId: user.id,
          status: "COMPLETED",
        },
      });
    }

    return NextResponse.json({
      success: true,
      scene: initialScene,
      character,
    });
  } catch (error) {
    console.error("Error in character selection:", error);
    return NextResponse.json(
      { error: "Failed to process character selection" },
      { status: 500 }
    );
  }
}
