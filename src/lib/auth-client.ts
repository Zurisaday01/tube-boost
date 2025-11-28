import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { auth } from 'auth';

// to use inside client components
// NOTE: `nextCookies` (from `better-auth/next-js`) is server-only and
// imports Node internals (`node:async_hooks`). Importing it here would
// pull server-only code into the client bundle and cause runtime
// failures like "Failed to fetch dynamically imported module: node:async_hooks".
// We therefore omit it from the client-side plugin list.
export const {
  signIn,
  signUp,
  useSession,
  signOut,
  getSession,
  sendVerificationEmail,
  requestPasswordReset,
  resetPassword,
  updateUser,
  changePassword
} = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>()]
});
