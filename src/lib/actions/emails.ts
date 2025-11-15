'use server';
import { RecoveryPasswordEmailTemplate } from '@/components/emails/recovery-password-email-template';
import { VerifyEmailTemplate } from '@/components/emails/verify-email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (name: string, url: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['zurisaday_01@hotmail.com'],
      subject: 'Password Recovery',
      react: RecoveryPasswordEmailTemplate({
        name,
        url
      })
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
};

export const sendVerificationEmail = async (
  name: string,
  email: string,
  url: string
) => {
  try {
    console.log('Sending verification email to:', email);
    const { data, error } = await resend.emails.send({
      // from: 'TubeBoost <account@tubeboost.dev>', // TODO: Set up dns records and change to this in the future
      from: 'onboarding@resend.dev',
      // to: [email],  // Use this line in production where I will have a valid dns setup
      to: ['zurisaday_01@hotmail.com'],
      subject: 'Verify your email',
      react: VerifyEmailTemplate({
        name,
        url
      })
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error sending verification email:', error);
    throw new Error('Failed to send verification email.');
  }
};
