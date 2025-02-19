import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { z } from "zod";

const requestSchema = z.object({
  sceneId: z.string(),
  type: z.enum(["character", "background"]),
  prompt: z.string(),
  character: z.string().optional(),
  emotion: z.string().optional(),
});

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

const getImageSettings = (type: "character" | "background") => {
  if (type === "background") {
    return {
      size: "1792x1024" as const,
      quality: "hd" as const,
      style: "vivid" as const,
    };
  }
  return {
    size: "1024x1024" as const,
    quality: "standard" as const,
    style: "natural" as const,
  };
};

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUser(token);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sceneId, type, prompt } = requestSchema.parse(body);

    // Check if user has already generated this scene
    const existingUserScene = await prisma.userScene.findUnique({
      where: {
        userId_sceneId: {
          userId,
          sceneId,
        },
      },
    });

    if (existingUserScene?.imageUrl) {
      return NextResponse.json({ imageUrl: existingUserScene.imageUrl });
    }

    // Check stamina
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stamina: true },
    });

    if (!user || user.stamina < 10) {
      return NextResponse.json(
        { error: "Insufficient stamina" },
        { status: 400 }
      );
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const imageSettings = getImageSettings(type);

    // Generate image with specific settings based on type
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      ...imageSettings,
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    // Save to UserScene
    const userScene = await prisma.userScene.upsert({
      where: {
        userId_sceneId: {
          userId,
          sceneId,
        },
      },
      update: {
        imageUrl,
        updatedAt: new Date(),
      },
      create: {
        userId,
        sceneId,
        imageUrl,
      },
    });

    // Deduct stamina
    await prisma.user.update({
      where: { id: userId },
      data: {
        stamina: {
          decrement: 10,
        },
      },
    });

    // Log stamina usage
    await prisma.staminaUsage.create({
      data: {
        userId,
        amount: 10,
        type: "SCENE_GENERATION",
      },
    });

    return NextResponse.json({ imageUrl: userScene.imageUrl });
  } catch (error) {
    console.error("Scene image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate scene image" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sceneId = searchParams.get("sceneId");
    const token = cookies().get("accessToken")?.value;

    if (!token || !sceneId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUser(token);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for existing image
    const existingUserScene = await prisma.userScene.findUnique({
      where: {
        userId_sceneId: {
          userId,
          sceneId,
        },
      },
      select: { imageUrl: true },
    });

    return NextResponse.json({ imageUrl: existingUserScene?.imageUrl || null });
  } catch (error) {
    console.error("Error checking existing image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
