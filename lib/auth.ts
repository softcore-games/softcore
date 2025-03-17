import { compare, hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret"
);

// Add this type
type User = {
  lastStaminaUpdate: any;
  id: string;
  username: string;
  email: string;
  stamina: number;
  walletAddress?: string | null;
  selectedCharacterId?: string | null;
};

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function createAuthToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

// Remove unused req parameter
export async function getAuthUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies(); // Add await here
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return null;
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    const userId = verified.payload.userId as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        stamina: true,
        walletAddress: true,
        selectedCharacterId: true,
        lastStaminaUpdate: true,
      },
    });

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
