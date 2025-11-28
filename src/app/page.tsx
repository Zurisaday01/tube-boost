import { redirect } from 'next/navigation';
import { requireSession } from '@/lib/auth-check';

// Flag this page is dynamic and should not be statically optimized
export const dynamic = 'force-dynamic';

export default async function Page() {
  // This will redirect automatically if no session
  await requireSession();

  // You already know session exists here
  redirect('/dashboard/playlists');
}
