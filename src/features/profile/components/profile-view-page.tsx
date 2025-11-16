'use client';
import { useSession } from '@/lib/auth-client';
import UserProfile from './user-profile';
import { Loader2 } from 'lucide-react';
import UpdateProfileForm from './update-profile-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import UpdatePasswordForm from './update-password-form';
import { redirect } from 'next/navigation';

export default function ProfileViewPage() {
  // Get the user session
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className='flex h-[90vh] w-full items-center justify-center'>
        <div className='flex flex-col items-center justify-center gap-1'>
          <Loader2 className='size-5 animate-spin' />
          <span className='ml-2'>Loading...</span>
        </div>
      </div>
    );
  }

  // Check if session and user exist before rendering
  if (!session || !session.user) {
    redirect('/auth/sign-in');
  }

  return (
    <PageContainer>
      <section className='flex w-full flex-col gap-6 pb-6 md:pb-0'>
        <UserProfile
          firstName={session.user.firstName}
          lastName={session.user.lastName}
          email={session.user.email}
        />

        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>General Information</CardTitle>
          </CardHeader>
          <CardContent>
            <UpdateProfileForm
              firstName={session.user.firstName}
              lastName={session.user.lastName}
              email={session.user.email}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Password Information</CardTitle>
          </CardHeader>
          <CardContent>
            <UpdatePasswordForm />
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}
