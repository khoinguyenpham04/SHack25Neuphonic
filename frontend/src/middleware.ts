import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    // Add other protected routes here
  ];

  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (isProtectedRoute) {
    // Get the token from the cookies
    const token = request.cookies.get('token');

    // If there's no token, redirect to the sign-in page
    if (!token) {
      const signInUrl = new URL('/signin', request.url);
      return NextResponse.redirect(signInUrl);
    }

    try {
      // Verify the token exists and is valid
      if (token) {
        return NextResponse.next();
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      // If token verification fails, redirect to sign-in
      const signInUrl = new URL('/signin', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Allow access to non-protected routes
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    // Add other protected paths here
  ],
};