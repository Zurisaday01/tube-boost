import ForgotPasswordViewPage from '@/features/auth/components/forgot-password-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Forgot Password',
  description: 'Forgot Password page.'
};

export default async function Page() {
  return <ForgotPasswordViewPage />;
}
