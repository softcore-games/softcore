import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, createAuthToken } from "@/lib/auth";
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
    const { login, password, captchaToken } = await req.json();

    // Verify CAPTCHA
    // const isValidCaptcha = await verifyCaptcha(captchaToken);
    // if (!isValidCaptcha) {
    //   return NextResponse.json({ error: "Invalid CAPTCHA" }, { status: 400 });
    // }

    if (!login || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate token
    const token = await createAuthToken(user.id);
    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Return user data without sensitive information
    return NextResponse.json(
      {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          stamina: user.stamina,
          walletAddress: user.walletAddress,
          selectedCharacterId: user.selectedCharacterId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
