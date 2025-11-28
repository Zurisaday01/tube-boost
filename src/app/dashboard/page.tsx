import { requireSession } from '@/lib/auth-check';
import { redirect } from 'next/navigation';
// This route needs access to request headers (via `headers()` in utilities)
// which makes it a dynamic server route. Force dynamic rendering so Next.js
// doesn't attempt to render it statically and throw the headers error.
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // This will redirect automatically if no session
  await requireSession();

  // You already know session exists here
  redirect('/dashboard/playlists');
}
