import { auth } from 'auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/auth/sign-in');
  return session;
}
