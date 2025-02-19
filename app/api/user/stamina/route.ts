import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { STAMINA_COSTS, STAMINA_LIMITS } from "@/lib/types/game";

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

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = await getUser(token);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if stamina needs to be reset (daily reset)
    const lastReset = new Date(user.lastStaminaReset);
    const now = new Date();
    const resetNeeded = lastReset.getDate() !== now.getDate();

    if (resetNeeded) {
      const subscriptionType = user.subscription?.type || "FREE";
      const maxStamina =
        STAMINA_LIMITS[subscriptionType as keyof typeof STAMINA_LIMITS];

      await prisma.user.update({
        where: { id: userId },
        data: {
          stamina: maxStamina,
          lastStaminaReset: now,
        },
      });

      return NextResponse.json({
        stamina: maxStamina,
        maxStamina,
        subscription: subscriptionType,
      });
    }

    const subscriptionType = user.subscription?.type || "FREE";
    const maxStamina =
      STAMINA_LIMITS[subscriptionType as keyof typeof STAMINA_LIMITS];

    return NextResponse.json({
      stamina: user.stamina,
      maxStamina,
      subscription: subscriptionType,
    });
  } catch (error) {
    console.error("Stamina fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stamina" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = await getUser(token);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type } = await req.json();
    const cost = STAMINA_COSTS[type as keyof typeof STAMINA_COSTS];

    if (!cost) {
      return NextResponse.json(
        { error: "Invalid action type" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has unlimited stamina
    if (user.subscription?.type === "UNLIMITED") {
      await prisma.staminaUsage.create({
        data: {
          userId,
          amount: cost,
          type,
        },
      });

      return NextResponse.json({
        stamina: Infinity,
        maxStamina: Infinity,
        subscription: "UNLIMITED",
      });
    }

    // Check if user has enough stamina
    if (user.stamina < cost) {
      return NextResponse.json(
        { error: "Insufficient stamina" },
        { status: 400 }
      );
    }

    // Deduct stamina and record usage
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        stamina: user.stamina - cost,
        staminaUsage: {
          create: {
            amount: cost,
            type,
          },
        },
      },
      include: {
        subscription: true,
      },
    });

    const subscriptionType = updatedUser.subscription?.type || "FREE";
    const maxStamina =
      STAMINA_LIMITS[subscriptionType as keyof typeof STAMINA_LIMITS];

    return NextResponse.json({
      stamina: updatedUser.stamina,
      maxStamina,
      subscription: subscriptionType,
    });
  } catch (error) {
    console.error("Stamina usage error:", error);
    return NextResponse.json(
      { error: "Failed to use stamina" },
      { status: 500 }
    );
  }
}
