import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user";

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
    const { plan } = await req.json();

    if (!["free", "premium", "unlimited"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid subscription plan" },
        { status: 400 }
      );
    }

    // Calculate expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Update or create subscription
    const subscription = await prisma.subscription.upsert({
      where: { userId },
      update: {
        type: plan.toUpperCase(),
        expiresAt,
      },
      create: {
        userId,
        type: plan.toUpperCase(),
        expiresAt,
      },
    });

    // Reset stamina based on new plan
    const maxStamina =
      plan === "unlimited" ? 999999 : plan === "premium" ? 200 : 100;
    await prisma.user.update({
      where: { id: userId },
      data: {
        stamina: maxStamina,
        lastStaminaReset: new Date(),
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Subscription upgrade error:", error);
    return NextResponse.json(
      { error: "Failed to upgrade subscription" },
      { status: 500 }
    );
  }
}
