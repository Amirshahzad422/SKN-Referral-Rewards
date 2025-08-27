import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout', '/favicon.ico', '/_next'];
const PUBLIC_FILE = /\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt|xml|css|js)$/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth for next internal, auth endpoints, and static files in public/
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('skn_token')?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}; 