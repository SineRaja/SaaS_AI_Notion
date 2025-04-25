// Import necessary libraries and components
import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'; // Supabase helper for server-side components
import { cookies } from 'next/headers'; // Utility to handle cookies
import db from '@/lib/supabase/db'; // Supabase database instance
import { redirect } from 'next/navigation'; // Next.js utility for navigation
import DashboardSetup from '@/components/dashboard-setup/dashboard-setup'; // Component for setting up the dashboard
import { getUserSubscriptionStatus } from '@/lib/supabase/queries'; // Query function for subscription status

// Async function component to handle the dashboard page logic
const DashboardPage = async () => {
  // Create a Supabase client for server-side components with access to cookies
  const supabase = createServerComponentClient({ cookies });

  // Retrieve the user object from Supabase auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user is found (not authenticated), stop the function early
  if (!user) return;

  // Query the database to find the first workspace owned by the user
  const workspace = await db.query.workspaces.findFirst({
    where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id),
  });

  // Retrieve the user's subscription status, and handle any errors that occur
  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  // If there's an error with the subscription query, stop the function early
  if (subscriptionError) return;

  // If no workspace is found, render the DashboardSetup component with user and subscription data
  if (!workspace)
    return (
      <div
        className="bg-background h-screen w-screen flex justify-center items-center"
      >
        <DashboardSetup
          user={user}
          subscription={subscription}
        />
      </div>
    );

  // If a workspace is found, redirect the user to their dashboard
  redirect(`/dashboard/${workspace.id}`);
};

// Export the DashboardPage as the default export of this module
export default DashboardPage;
