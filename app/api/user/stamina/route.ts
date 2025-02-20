import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { STAMINA_COSTS, STAMINA_LIMITS } from "@/lib/types/game";
import { getUser } from "@/lib/user";

async function calculateCurrentStamina(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
      staminaTransactions: {
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of current day
          },
        },
      },
    },
  });

  if (!user) throw new Error("User not found");

  // If user has unlimited subscription, return infinity
  if (user.subscription?.type === "UNLIMITED") {
    return {
      current: Infinity,
      max: Infinity,
      subscription: "UNLIMITED",
    };
  }

  // Calculate current stamina from transactions
  const currentStamina = user.staminaTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const subscriptionType = user.subscription?.type || "FREE";
  const maxStamina =
    STAMINA_LIMITS[subscriptionType as keyof typeof STAMINA_LIMITS];

  return {
    current: Math.min(currentStamina, maxStamina),
    max: maxStamina,
    subscription: subscriptionType,
  };
}

async function resetDailyStamina(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) throw new Error("User not found");

  const subscriptionType = user.subscription?.type || "FREE";
  const maxStamina =
    STAMINA_LIMITS[subscriptionType as keyof typeof STAMINA_LIMITS];

  // Create a reset transaction
  await prisma.staminaTransaction.create({
    data: {
      userId,
      amount: maxStamina,
      reason: "DAILY_RESET",
      metadata: {
        subscriptionType,
        resetTime: new Date().toISOString(),
      },
    },
  });

  // Update last reset time
  await prisma.user.update({
    where: { id: userId },
    data: { lastStaminaReset: new Date() },
  });

  return maxStamina;
}

export async function GET() {
  const token = cookies().get("accessToken")?.value;
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
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if stamina needs to be reset (daily)
    const lastReset = new Date(user.lastStaminaReset);
    const now = new Date();
    const resetNeeded = lastReset.getDate() !== now.getDate();

    if (resetNeeded) {
      await resetDailyStamina(userId);
    }

    const staminaInfo = await calculateCurrentStamina(userId);
    return NextResponse.json(staminaInfo);
  } catch (error) {
    console.error("Stamina fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stamina" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const token = cookies().get("accessToken")?.value;
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

    // Get current stamina
    const { current: currentStamina } = await calculateCurrentStamina(userId);

    // Check if user has enough stamina
    if (currentStamina < cost) {
      return NextResponse.json(
        { error: "Insufficient stamina" },
        { status: 400 }
      );
    }

    // Create stamina usage transaction
    await prisma.staminaTransaction.create({
      data: {
        userId,
        amount: -cost,
        reason: type,
        metadata: {
          actionType: type,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Return updated stamina info
    const updatedStaminaInfo = await calculateCurrentStamina(userId);
    return NextResponse.json(updatedStaminaInfo);
  } catch (error) {
    console.error("Stamina usage error:", error);
    return NextResponse.json(
      { error: "Failed to use stamina" },
      { status: 500 }
    );
  }
}
