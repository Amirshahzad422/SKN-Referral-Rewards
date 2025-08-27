import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.set('skn_token', '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
} 