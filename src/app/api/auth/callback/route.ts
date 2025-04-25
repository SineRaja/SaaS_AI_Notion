// Import the necessary modules from the Supabase auth helpers for Next.js and Next.js server utilities
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
// Import cookies from 'next/headers' to handle cookies within the server-side environment
import { cookies } from 'next/headers';

// Define an asynchronous GET function to process incoming GET requests
export async function GET(req: NextRequest) {
  // Create a new URL object from the request URL
  const requestUrl = new URL(req.url);
  // Extract the 'code' parameter from the URL search parameters
  const code = requestUrl.searchParams.get('code');

  // Check if the 'code' parameter is present in the URL
  if (code) {
    // Create a Supabase client instance configured for handling routes, including cookie management
    const supabase = createRouteHandlerClient({ cookies });
    // Exchange the received code for a session using Supabase's built-in method
    await supabase.auth.exchangeCodeForSession(code);
  }
  // Redirect the user to the dashboard page of the origin from where the request was made
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
