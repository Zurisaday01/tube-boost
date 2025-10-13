// Utility functions for server actions
import { auth } from 'auth';
import { headers } from 'next/headers';

export const getSessionUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const userId = session?.user?.id;
  return {
    session,
    userId,
    isAuthenticated: !!userId
  };
};

// Type guard to check if user is authenticated
export const isUserAuthenticated = (
  user: Awaited<ReturnType<typeof getSessionUser>>
): user is { session: any; userId: string; isAuthenticated: true } => {
  return user.isAuthenticated && !!user.userId;
};
