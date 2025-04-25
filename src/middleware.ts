// Import necessary modules from the Supabase auth helpers and Next.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

// Define the middleware function to be applied on Next.js server side
export async function middleware(req: NextRequest) {
  // Create a response object to continue with the middleware flow
  const res = NextResponse.next();

  // Initialize a Supabase client for middleware purposes
  const supabase = createMiddlewareClient({ req, res });

  // Retrieve the current session from Supabase to check user authentication status
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect the user to the login page if they try to access the dashboard without a session
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/singin', req.url));
    }
  }

  // Define an error message for invalid or expired email links
  const emailLinkError = 'Email link is invalid or has expired';

  // Redirect the user to the signup page with an error description if the email link is invalid and they are not on the signup page
  if (
    req.nextUrl.searchParams.get('error_description') === emailLinkError &&
    req.nextUrl.pathname !== '/createAccount'
  ) {
    return NextResponse.redirect(
      new URL(
        `/createAccount?error_description=${req.nextUrl.searchParams.get(
          'error_description'
        )}`,
        req.url
      )
    );
  }

  // Redirect the user to the dashboard if they are already logged in and try to access the login or signup pages
  if (['/singin', '/createAccount'].includes(req.nextUrl.pathname)) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // If none of the conditions apply, continue with the normal response
  return res;
}
