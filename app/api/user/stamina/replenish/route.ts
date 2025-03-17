import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const STAMINA_MAX = 10; // Maximum stamina
const STAMINA_PER_HOUR = 10;
const MS_PER_HOUR = 3600000; // 1 hour in milliseconds

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate hours since last update
    const hoursSinceUpdate = Math.floor(
      (Date.now() - user.lastStaminaUpdate.getTime()) / MS_PER_HOUR
    );

    if (hoursSinceUpdate < 1) {
      return NextResponse.json({ user }, { status: 200 });
    }

    // Calculate new stamina
    const staminaToAdd = Math.min(
      hoursSinceUpdate * STAMINA_PER_HOUR,
      STAMINA_MAX - user.stamina
    );
    const newStamina = Math.min(user.stamina + staminaToAdd, STAMINA_MAX);

    // Update user's stamina and lastStaminaUpdate
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        stamina: newStamina,
        lastStaminaUpdate: new Date(),
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Stamina replenish error:", error);
    return NextResponse.json(
      { error: "Failed to replenish stamina" },
      { status: 500 }
    );
  }
}
