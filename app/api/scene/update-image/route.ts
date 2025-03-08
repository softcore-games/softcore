import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sceneId, imageUrl } = await req.json();

    const updatedScene = await prisma.scene.update({
      where: {
        id: sceneId,
        userId: user.id, // Ensure the scene belongs to the user
      },
      data: {
        imageUrl,
      },
    });

    return NextResponse.json({ scene: updatedScene });
  } catch (error) {
    console.error("Failed to update scene image:", error);
    return NextResponse.json(
      { error: "Failed to update scene image" },
      { status: 500 }
    );
  }
}