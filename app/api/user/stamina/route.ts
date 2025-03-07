import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { decrease } = await req.json();

    // Update user's stamina
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        stamina: decrease ? { decrement: 1 } : { increment: 1 },
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Stamina update error:", error);
    return NextResponse.json(
      { error: "Failed to update stamina" },
      { status: 500 }
    );
  }
}
