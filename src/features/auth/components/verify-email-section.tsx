import { Button } from '@/components/ui/button';
import { sendVerificationEmail } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface VerifyEmailSectionProps {
  email: string;
  shouldStartCountdown?: boolean;
}

export default function VerifyEmailSection({
  email,
  shouldStartCountdown = true
}: VerifyEmailSectionProps) {
  const [timeToNextResend, setTimeToNextResend] = useState(() => {
    // Initialize countdown time based on prop
    // when shouldStartCountdown is false, start at 0
    return shouldStartCountdown ? 30 : 0;
  }); // 30 seconds countdown
  const interval = useRef<ReturnType<typeof setInterval> | null>(null); // to store the interval ID
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (shouldStartCountdown) {
      startEmailVerificationCountdown();
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [shouldStartCountdown]);

  const startEmailVerificationCountdown = (time = 30) => {
    setTimeToNextResend(time);

    if (interval.current) clearInterval(interval.current);
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1;

        if (newT <= 0) {
          if (interval.current) clearInterval(interval.current);
          return 0;
        }
        return newT;
      });
    }, 1000);
  };

  const handleResend = async () => {
    // start the countdown again
    startEmailVerificationCountdown();
    setIsLoading(true);
    try {
      // Triggering manually Email Verification
      await sendVerificationEmail(
        {
          email,
          callbackURL: '/dashboard' // The redirect URL after verification
        },
        {
          onRequest(context) {
            console.log(
              'Resend verification email request initiated.',
              context
            );
          },
          onSuccess: () => {
            toast.success(
              'Verification email resent! Please check your inbox.'
            );
          },
          onError: (error) => {
            toast.error(
              error.error.message || 'Failed to resend verification email.'
            );
          }
        }
      );
    } catch (error) {
      console.error('Error resending verification email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='absolute top-0 left-0 flex h-screen w-full flex-col bg-white'>
      <div className='absolute top-4 left-1/2 -translate-x-1/2'>
        <span className='font-oswald block p-2 text-2xl font-semibold'>
          TubeBoost
        </span>
      </div>
      {/* Center content */}
      <div className='flex h-full flex-grow flex-col items-center justify-center space-y-6'>
        <div className='w-full max-w-[500px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-4xl font-bold'>Verify your Email</h1>
            <p>
              We sent a verification email to your inbox. Please check your
              email and follow the instructions to verify your account.
            </p>
          </div>

          <div className='mt-8'>
            <div className='flex flex-col space-y-2 text-center'>
              <p>
                You can resend the verification email by clicking the button
                below if you didn&apos;t receive it.
              </p>
              <Button
                disabled={isLoading || timeToNextResend > 0}
                onClick={handleResend}
                className='w-full'
              >
                {isLoading ? (
                  <Loader2 className='size-5 animate-spin' />
                ) : timeToNextResend > 0 ? (
                  `Resend Email (${timeToNextResend})`
                ) : (
                  'Resend Email'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
