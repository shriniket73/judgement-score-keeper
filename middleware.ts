// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect game routes
  if (path.startsWith('/game/') && path !== '/game/setup') {
    // In a real implementation, we'd check for valid game state
    // For now, we'll just ensure the path includes an ID
    const gameId = path.split('/')[2];
    if (!gameId) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/game/:path*',
};