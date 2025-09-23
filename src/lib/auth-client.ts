import { nextCookies } from 'better-auth/next-js';
import { createAuthClient } from 'better-auth/react';

// to use inside client components
export const { signIn, signUp, useSession } = createAuthClient({
  baseURL: 'http://localhost:3000', // The base URL of your auth server
  plugins: [nextCookies()]
});
