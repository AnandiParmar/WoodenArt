import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is an admin route
  if (pathname.startsWith('/admin')) {
    // Get isAuthenticated and role from cookies
    const isAuthenticated = request.cookies.get('isAuthenticated')?.value;
    const role = request.cookies.get('role')?.value;
    
    // Check if user is authenticated and is admin
    if (isAuthenticated !== 'true' || role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};

