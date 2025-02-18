import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

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

export async function POST(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    // For non-authenticated users, just return success
    // They'll need to verify again when they create an account
    return NextResponse.json({ success: true });
  }

  const userId = await getUser(token);
  if (!userId) {
    return NextResponse.json({ success: true });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isAgeVerified: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Age verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify age' },
      { status: 500 }
    );
  }
}