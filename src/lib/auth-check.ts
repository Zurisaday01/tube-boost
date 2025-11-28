import { auth } from 'auth';
import { Session } from 'better-auth/*';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireSession(): Promise<Session> {
  try {
    const response = await auth.api.getSession({ headers: await headers() });
    if (!response?.session) redirect('/auth/sign-in');
    return response.session;
  } catch (error) {
    console.error('Failed to get session:', error);
    redirect('/auth/sign-in');
  }
}
