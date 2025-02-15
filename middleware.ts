import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/game', '/profile', '/settings'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('accessToken')?.value;

  // Check if the path requires authentication
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/game/:path*', '/profile/:path*', '/settings/:path*'],
};