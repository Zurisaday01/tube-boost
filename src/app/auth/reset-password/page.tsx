import ResetPasswordViewPage from '@/features/auth/components/reset-password-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Reset Password',
  description: 'Reset Password page for authentication.'
};

export default async function Page() {
  return <ResetPasswordViewPage />;
}
