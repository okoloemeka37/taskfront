import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  let userData = null;

  const userCookie = request.cookies.get('user')?.value;
  if (userCookie) {
    try {
      userData = JSON.parse(userCookie);
    } catch (error) {
      console.error('Failed to parse user cookie', error);
    }
  }

  const protectedPaths = ['/Dashbord'];

  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected) {
    if (!token) {
      const loginUrl = new URL('/Auth/Login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
  }if (userData?.email_verified_at == null) {
      const verifyUrl = new URL('/verify-email', request.url);
      if (!token) {
        const loginUrl = new URL('/Auth/Login', request.url);
        return NextResponse.redirect(loginUrl);
      }else{ return NextResponse.redirect(verifyUrl);}
     
    }

  return NextResponse.next();
}

export const config = {
  matcher: ['/Dashbord/:path*'], // (fixed spelling if needed)
};
