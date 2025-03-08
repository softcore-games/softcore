import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sceneId } = await req.json();
    if (!sceneId) {
      return NextResponse.json(
        { error: "Scene ID is required" },
        { status: 400 }
      );
    }

    // Update the scene to mark it as ready for minting
    const scene = await prisma.scene.update({
      where: {
        id: sceneId,
        userId: user.id, // Ensure the scene belongs to the user
      },
      data: {
        nftMinted: true,
      },
    });

    return NextResponse.json({ success: true, scene });
  } catch (error) {
    console.error("Failed to prepare scene for minting:", error);
    return NextResponse.json(
      { error: "Failed to prepare scene for minting" },
      { status: 500 }
    );
  }
}
