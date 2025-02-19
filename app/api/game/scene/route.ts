import { NextResponse } from "next/server";
import { generateScene } from "@/lib/game/script";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { previousScene, playerChoice } = body;

    const scene = await generateScene(previousScene, playerChoice);
    return NextResponse.json(scene);
  } catch (error) {
    console.error("Failed to generate scene:", error);
    return NextResponse.json(
      { error: "Failed to generate scene" },
      { status: 500 }
    );
  }
}
