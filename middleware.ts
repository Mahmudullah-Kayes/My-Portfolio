import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Only redirect if exactly at /dashboard path and not already at login
  if (request.nextUrl.pathname === '/dashboard' && !request.nextUrl.pathname.includes('/login')) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'],
}; 