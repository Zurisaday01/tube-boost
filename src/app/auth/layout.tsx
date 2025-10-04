import { auth } from 'auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Redirecting if there is a session
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session) {
      // If there is a session, redirect to the dashboard
      redirect('/dashboard');
    }
  } catch (error) {
    console.error('Failed to check session:', error);
    // Allow rendering auth pages on error
  }

  return <>{children}</>;
}
