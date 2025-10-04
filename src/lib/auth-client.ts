import { nextCookies } from 'better-auth/next-js';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { auth } from 'auth';

// to use inside client components
export const { signIn, signUp, useSession, signOut } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [nextCookies(), inferAdditionalFields<typeof auth>()]
});
