import { redirect } from 'next/navigation';
import { requireSession } from '@/lib/auth-check';

export default async function Page() {
  // This will redirect automatically if no session
  await requireSession();

  // You already know session exists here
  redirect('/dashboard/playlists');
}
