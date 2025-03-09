import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, price, transactionHash } = await req.json();

    // Create transaction record
    const transaction = await prisma.staminaTransaction.create({
      data: {
        userId: user.id,
        amount,
        price,
        transactionHash,
      },
    });

    // Update user's stamina
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        stamina: { increment: amount },
      },
    });

    return NextResponse.json({ transaction, user: updatedUser });
  } catch (error) {
    console.error("Transaction error:", error);
    return NextResponse.json(
      { error: "Failed to process transaction" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await prisma.staminaTransaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
