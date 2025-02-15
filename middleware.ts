import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/game', '/profile', '/settings'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path requires authentication
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    // Get token from cookie instead of header
    const token = request.cookies.get('refreshToken');

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/game/:path*', '/profile/:path*', '/settings/:path*'],
};