import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  url: string;
}

export function RecoveryPasswordEmailTemplate({
  firstName,
  url
}: EmailTemplateProps) {
  return (
    <div>
      <h1>Hello, {firstName}!</h1>
      <p>
        You requested a password reset. Click the link below to reset your
        password:
      </p>
      <a href={url}>Reset Password</a>

      <div className='mt-6'>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    </div>
  );
}
