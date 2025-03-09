import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, createAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";

// async function verifyCaptcha(token: string) {
//   const response = await fetch(
//     `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
//     { method: "POST" }
//   );
//   const data = await response.json();
//   return data.success;
// }

export async function POST(req: Request) {
  try {
    const { username, email, password, captchaToken } = await req.json();

    // // Verify CAPTCHA
    // const isValidCaptcha = await verifyCaptcha(captchaToken);
    // if (!isValidCaptcha) {
    //   return NextResponse.json({ error: "Invalid CAPTCHA" }, { status: 400 });
    // }

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        stamina: 3,
      },
    });

    // Generate token
    const token = await createAuthToken(user.id);
    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          stamina: user.stamina,
          walletAddress: user?.walletAddress || "",
          selectedCharacterId: user.selectedCharacterId,
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
