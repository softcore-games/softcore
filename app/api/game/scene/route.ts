import { NextResponse } from "next/server";
import { generateScene } from "@/lib/game/script";
import { generateSceneImages } from "@/lib/game/dialogue";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { STAMINA_COSTS } from "@/lib/types/game";
import { getUser } from "@/lib/user";

async function checkAndUpdateStamina(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) throw new Error("User not found");

  // Free users need stamina
  if (user.subscription?.type !== "UNLIMITED") {
    if (user.stamina < STAMINA_COSTS.SCENE_GENERATION) {
      throw new Error("Insufficient stamina");
    }

    // Deduct stamina and log usage
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { stamina: user.stamina - STAMINA_COSTS.SCENE_GENERATION },
      }),
      prisma.staminaUsage.create({
        data: {
          userId,
          amount: STAMINA_COSTS.SCENE_GENERATION,
          type: "SCENE_GENERATION",
        },
      }),
    ]);
  }
}

export async function POST(request: Request) {
  try {
    // Auth check
    const token = cookies().get("accessToken")?.value;
    const userId = token ? await getUser(token) : null;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { previousScene, playerChoice } = await request.json();

    // Check stamina before generating new scene
    if (!previousScene) {
      await checkAndUpdateStamina(userId);
    }

    // Check for existing unviewed scene first
    const existingUserScene = await prisma.userScene.findFirst({
      where: {
        userId,
        viewed: false,
      },
      include: {
        scene: true,
      },
    });

    if (existingUserScene?.scene) {
      const scene = existingUserScene.scene;

      // Generate missing images if needed
      if (!scene.characterImage || !scene.backgroundImage) {
        const images = await generateSceneImages(scene);
        const updatedScene = await prisma.scene.update({
          where: { sceneId: scene.sceneId },
          data: images,
        });
        return NextResponse.json({ scene: updatedScene });
      }
      return NextResponse.json({ scene });
    }

    // Generate new scene
    const scene = await generateScene(previousScene, playerChoice);

    // Check for existing scene by sceneId
    const existingScene = await prisma.scene.findUnique({
      where: { sceneId: scene.sceneId },
    });

    if (existingScene) {
      // Create UserScene relation and return existing scene
      await prisma.userScene.create({
        data: {
          userId,
          sceneId: scene.sceneId,
          viewed: false,
        },
      });

      // Generate missing images if needed
      if (!existingScene.characterImage || !existingScene.backgroundImage) {
        const images = await generateSceneImages(existingScene);
        const updatedScene = await prisma.scene.update({
          where: { sceneId: scene.sceneId },
          data: images,
        });
        return NextResponse.json({ scene: updatedScene });
      }
      return NextResponse.json({ scene: existingScene });
    }

    // Create new scene with images
    const images = await generateSceneImages(scene);
    const [newScene] = await prisma.$transaction([
      prisma.scene.create({
        data: {
          sceneId: scene.sceneId,
          character: scene.character,
          emotion: scene.emotion,
          text: scene.text,
          next: scene.next,
          choices: scene.choices,
          context: scene.context,
          requiresAI: scene.requiresAI,
          background: scene.background,
          ...images,
          type: scene.type,
          metadata: scene.metadata,
        },
      }),
      prisma.userScene.create({
        data: {
          userId,
          sceneId: scene.sceneId,
          viewed: false,
        },
      }),
    ]);

    return NextResponse.json({ scene: newScene });
  } catch (error) {
    console.error("Failed to generate scene:", error);
    return NextResponse.json(
      { error: "Failed to generate scene" },
      { status: 500 }
    );
  }
}
