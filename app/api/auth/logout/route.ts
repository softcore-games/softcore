import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear access token cookie
  response.cookies.delete('accessToken');
  
  return response;
}