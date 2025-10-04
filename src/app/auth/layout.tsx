import { auth } from 'auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Redirecting if there is a session
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    // If there is a session, redirect to the dashboard
    redirect('/dashboard');
  }

  return <>{children}</>;
}
