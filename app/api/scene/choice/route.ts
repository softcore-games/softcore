import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sceneId, choiceIndex, choiceText } = await req.json();

    // Validate scene exists and belongs to user's current character
    const scene = await prisma.scene.findFirst({
      where: {
        id: sceneId,
        userId: user.id,
      },
    });

    if (!scene) {
      return NextResponse.json({ error: "Scene not found" }, { status: 404 });
    }

    // Upsert the choice to handle both new choices and updates
    const choice = await prisma.sceneChoice.upsert({
      where: {
        userId_sceneId: {
          userId: user.id,
          sceneId: scene.id,
        },
      },
      update: {
        choiceIndex,
        choiceText,
      },
      create: {
        userId: user.id,
        sceneId: scene.id,
        choiceIndex,
        choiceText,
      },
    });

    return NextResponse.json({ choice }, { status: 200 });
  } catch (error) {
    console.error("Choice API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
