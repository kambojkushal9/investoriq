import NextAuth from "next-auth"
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('[Auth] Missing email or password');
            return null;
          }
          const [user] = await db.select().from(schema.users).where(eq(schema.users.email, credentials.email as string)).limit(1);
          if (!user) {
            console.log('[Auth] No user found for email:', credentials.email);
            return null;
          }
          if (!user.password) {
            console.log('[Auth] User has no password (OAuth-only account):', credentials.email);
            return null;
          }
          const isValid = await bcrypt.compare(credentials.password as string, user.password);
          if (!isValid) {
            console.log('[Auth] Invalid password for:', credentials.email);
            return null;
          }
          return user;
        } catch (error) {
          console.error('[Auth] Error in authorize:', error);
          return null;
        }
      }
    })
  ]
})
