import { NextResponse } from "next/server";
import { generateScene } from "@/lib/game/script";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import OpenAI from "openai";
import { SceneResponse } from "@/lib/types/game";

async function getUser(token: string) {
  try {
    const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
    };
    return decoded.userId;
  } catch {
    return null;
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

    // Check for existing scene
    if (!previousScene) {
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

        // Check if scene is missing images
        if (!scene.characterImage || !scene.backgroundImage) {
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
          const [backgroundImage, characterImage] = await Promise.all([
            !scene.backgroundImage
              ? openai.images.generate({
                  model: "dall-e-3",
                  prompt: `Detailed ${
                    scene.background || "classroom"
                  } setting. High quality anime background art, visual novel style, cinematic wide view, no characters, highly detailed environment, professional lighting, 16:9 aspect ratio.`,
                  n: 1,
                  size: "1792x1024",
                  quality: "hd" as const,
                  style: "vivid" as const,
                })
              : null,
            !scene.characterImage
              ? openai.images.generate({
                  model: "dall-e-3",
                  prompt: `Full body portrait of an anime character showing ${scene.emotion} emotion. Visual novel style, high quality, transparent background, centered composition, detailed facial features and clothing, professional lighting.`,
                  n: 1,
                  size: "1024x1024",
                  quality: "standard" as const,
                  style: "natural" as const,
                })
              : null,
          ]);

          // Update scene with missing images
          const updatedScene = await prisma.scene.update({
            where: { sceneId: scene.sceneId },
            data: {
              characterImage:
                characterImage?.data[0]?.url || scene.characterImage,
              backgroundImage:
                backgroundImage?.data[0]?.url || scene.backgroundImage,
            },
          });
          return NextResponse.json({ scene: updatedScene });
        }
        return NextResponse.json({ scene });
      }
    }

    // Generate new scene with images
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const scene = await generateScene(previousScene, playerChoice);

    // Check if scene already exists to prevent duplicates
    const existingScene = await prisma.scene.findUnique({
      where: { sceneId: scene.sceneId },
    });

    if (existingScene) {
      // If scene exists, just create the UserScene relation
      await prisma.userScene.create({
        data: {
          userId,
          sceneId: scene.sceneId,
          viewed: false,
        },
      });
      return NextResponse.json({ scene: existingScene });
    }

    // Generate both images in parallel
    const [backgroundImage, characterImage] = await Promise.all([
      openai.images.generate({
        model: "dall-e-3",
        prompt: `Detailed ${
          scene.background || "classroom"
        } setting. High quality anime background art, visual novel style, cinematic wide view, no characters, highly detailed environment, professional lighting, 16:9 aspect ratio.`,
        n: 1,
        size: "1792x1024",
        quality: "hd" as const,
        style: "vivid" as const,
      }),
      openai.images.generate({
        model: "dall-e-3",
        prompt: `Full body portrait of an anime character showing ${scene.emotion} emotion. Visual novel style, high quality, transparent background, centered composition, detailed facial features and clothing, professional lighting.`,
        n: 1,
        size: "1024x1024",
        quality: "standard" as const,
        style: "natural" as const,
      }),
    ]);

    // Create scene and user scene in a transaction
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
          characterImage: characterImage.data[0]?.url || null,
          backgroundImage: backgroundImage.data[0]?.url || null,
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
