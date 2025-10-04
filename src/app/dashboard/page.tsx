import { requireSession } from '@/lib/auth-check';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  // This will redirect automatically if no session
  await requireSession();

  // You already know session exists here
  redirect('/dashboard/playlists');
}
