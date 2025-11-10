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

    if (session != null) {
      // If there is a session, redirect to the dashboard
      redirect('/dashboard');
    }
  } catch (error) {
    throw error;
  }

  return <>{children}</>;
}
