import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is an admin route
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;
    // console.log(token)
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // console.log(process.env.JWT_SECRET)
    // try {
    //   const user = jwt.verify(token, process.env.JWT_SECRET as string);
    //   console.log("user",user)
    //   if (!user || user.role !== 'ADMIN') {
    //     return NextResponse.redirect(new URL('/', request.url));
    //   }
    // } catch (error) {
    //   console.log("error",error)
    //   return NextResponse.redirect(new URL('/', request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};

