import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

    // Update both the selected character and its image
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { selectedCharacterId: characterId },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error selecting character:", error);
    return NextResponse.json(
      { error: "Failed to select character" },
      { status: 500 }
    );
  }
}
