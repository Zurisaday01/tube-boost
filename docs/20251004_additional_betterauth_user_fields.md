# Better Auth with Additional Fields (Prisma + Next.js)

This guide explains how to configure Better Auth with additional user fields like `firstName` and `lastName`, store them in a PostgreSQL database via Prisma, and use them in your client code for signup and session management.

## 📦 1. Install Dependencies

Make sure you have installed the required packages:

```bash
npm install better-auth @prisma/client prisma
```

## 🗄️ 2. Update Your Prisma Schema

Better Auth requires the `User` model to have a `name` field. Additional fields (like `firstName` and `lastName`) must also be defined in the model.

**Example Schema:**

```prisma
model User {
  id            String          @id @default(cuid())
  name          String          // required by Better Auth
  firstName     String          // additional field
  lastName      String          // additional field
  email         String
  emailVerified Boolean
  image         String?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  sessions      Session[]
  accounts      Account[]
  Playlist      Playlist[]
  VideoMetadata VideoMetadata[]
  PlaylistNote  PlaylistNote[]
  ChannelRule   ChannelRule[]

  @@unique([email])
  @@map("user")
}
```

> **💡 Tip:** Run `prisma migrate dev --name add_additional_fields` after updating the schema to apply changes to your database.

## ⚙️ 3. Configure Better Auth on the Server

Create an auth configuration with `additionalFields` in your server setup:

```typescript
// auth.ts
import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      firstName: { type: 'string', required: true },
      lastName: { type: 'string', required: true }
    }
  }
});
```

**Explanation:**

- `additionalFields` allows you to add extra fields for users
- `required: true` ensures these fields are mandatory during signup
- Better Auth will automatically validate these fields

## 🖥️ 4. Setup Client-Side Auth

You need to infer the auth fields:

```typescript
// auth-client.ts
import { nextCookies } from 'better-auth/next-js';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { auth } from './auth';

export const { signIn, signUp, useSession, signOut } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [nextCookies(), inferAdditionalFields<typeof auth>()] // infer fields
});
```

**Explanation:**

- `inferAdditionalFields` makes TypeScript aware of your `firstName` and `lastName`
- You can now pass these fields when signing up a user

## 👤 5. Sign Up Users with Additional Fields

Example using React form values:

```typescript
const res = await signUp.email({
  name: `${values.firstName} ${values.lastName}`, // required 'name' field
  firstName: values.firstName, // additional field
  lastName: values.lastName, // additional field
  email: values.email,
  password: values.password
});
```

**Explanation:**

- `name` is still required by Better Auth; combine first and last name
- `firstName` and `lastName` are passed explicitly and stored in the DB


## 📝 7. Important Notes

- **Migration:** Always run Prisma migrations after adding new fields
- **Validation:** `required: true` ensures users cannot sign up without these fields
- **Name field:** Always provide the `name` field necessary for Better Auth compatibility
- **Type safety:** Using `inferAdditionalFields<typeof auth>()` keeps TypeScript aware of all custom fields
