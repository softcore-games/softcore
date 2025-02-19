import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { sceneId: string } }
) {
  try {
    const { characterImage, backgroundImage } = await req.json();

    const updatedScene = await prisma.scene.update({
      where: { sceneId: params.sceneId },
      data: {
        characterImage,
        backgroundImage,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedScene);
  } catch (error) {
    console.error("Failed to update scene images:", error);
    return NextResponse.json(
      { error: "Failed to update scene images" },
      { status: 500 }
    );
  }
}
