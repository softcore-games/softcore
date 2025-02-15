import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/game', '/profile', '/settings'];

export function middleware(request: NextRequest) {
  const accessToken = request.headers.get('authorization')?.split(' ')[1];
  const path = request.nextUrl.pathname;

  // Check if the path requires authentication
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      verify(accessToken, process.env.NEXTAUTH_SECRET!);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/game/:path*', '/profile/:path*', '/settings/:path*'],
};