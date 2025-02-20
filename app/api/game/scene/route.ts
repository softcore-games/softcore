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
    include: {
      subscription: true,
      staminaTransactions: {
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of current day
          },
        },
      },
    },
  });

  if (!user) throw new Error("User not found");

  // Free users need stamina
  if (user.subscription?.type !== "UNLIMITED") {
    const currentStamina = user.staminaTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

    if (currentStamina < STAMINA_COSTS.SCENE_GENERATION) {
      throw new Error("Insufficient stamina");
    }

    // Create stamina usage transaction
    await prisma.staminaTransaction.create({
      data: {
        userId,
        amount: -STAMINA_COSTS.SCENE_GENERATION,
        reason: "SCENE_GENERATION",
        metadata: {
          actionType: "SCENE_GENERATION",
          timestamp: new Date().toISOString(),
        },
      },
    });
  }
}

async function refundStamina(userId: string) {
  await prisma.staminaTransaction.create({
    data: {
      userId,
      amount: STAMINA_COSTS.SCENE_GENERATION, // Positive amount for refund
      reason: "SCENE_GENERATION_REFUND",
      metadata: {
        timestamp: new Date().toISOString(),
        reason: "Scene generation failed",
      },
    },
  });
}

export async function POST(request: Request) {
  let staminaDeducted = false;
  let userId: string | null = null;

  try {
    // Auth check
    const token = cookies().get("accessToken")?.value;
    userId = token ? await getUser(token) : null;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { previousScene, playerChoice } = await request.json();

    // Check stamina before generating new scene
    if (!previousScene) {
      await checkAndUpdateStamina(userId);
      staminaDeducted = true;
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
    let scene;
    try {
      scene = await generateScene(previousScene, playerChoice);
    } catch (sceneError) {
      // Refund stamina if it was deducted and scene generation failed
      if (staminaDeducted && userId) {
        await refundStamina(userId);
      }
      throw sceneError;
    }

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
