import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  emailAndPassword: {
    enabled: true
  },
  // cache the session cookie for performance
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5 // 5 minutes (general recommendation is short duration)
    }
  },
  // so the app knows to read cookies from Next.js requests on the server side
  plugins: [nextCookies()],
  //   trustedOrigins: ['http://localhost:3001'], // Uncomment if you have a frontend running on a different port
  user: {
    additionalFields: {
      firstName: { type: 'string', required: true },
      lastName: { type: 'string', required: true }
    }
  }
});
