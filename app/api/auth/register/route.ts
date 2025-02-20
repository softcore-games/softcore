import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user with initial stamina transaction
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        lastStaminaReset: new Date(),
        staminaTransactions: {
          create: {
            amount: 100, // Initial stamina
            reason: "INITIAL",
            metadata: {
              type: "REGISTRATION",
              timestamp: new Date().toISOString(),
            },
          },
        },
        gameState: {
          create: {
            progress: {},
            relationships: {},
            choices: {},
            settings: {
              volume: 100,
              textSpeed: "normal",
              autoplay: false,
            },
          },
        },
      },
      include: {
        staminaTransactions: true,
      },
    });

    const currentStamina = user.staminaTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          currentStamina,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
