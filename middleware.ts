import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
const user=request.cookies.get('user')?.value;
const userData = user ? JSON.parse(user) : null;
  const token = request.cookies.get('authToken')?.value  ;

  // List of paths that need protection
  const protectedPaths = ['/Dashbord'];

  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && (token==null )) {
    const loginUrl = new URL('/Auth/Login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  if(userData?.email_verified_at==null){
    const loginUrl = new URL('/verify-email', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware to specific routes only
export const config = {
  matcher: ['/Dashbord/:path*'],
};
