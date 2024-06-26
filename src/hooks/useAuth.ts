import NextAuth from "next-auth";

import CredentialsProvider from "@/hooks/components/CredentialsProvider"
import GitHub from "next-auth/providers/github";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
    providers: [GitHub, CredentialsProvider],
    callbacks: {
      async session({ session, token }) {
        const email = token.email || session?.user?.email;
        if (!email) return session;

        const [user] = await db
          .select({
            id: usersTable.displayId,
            provider: usersTable.provider,
          })
          .from(usersTable)
          .where(eq(usersTable.email, email.toLowerCase()))
          .execute();
        
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
            provider: user.provider,
          },
        };
      },
      async jwt({ token, account }) {
        // Sign in with social account, e.g. GitHub, Google, etc.
        if (!account) return token;
        const { name, email } = token;
        const provider = account.provider;
        if (!name || !email || !provider) return token;

        // Check if the email has been registered
        const [existedUser] = await db
          .select({
            id: usersTable.displayId,
          })
          .from(usersTable)
          .where(eq(usersTable.email, email.toLowerCase()))
          .execute();
        if (existedUser) return token;
        if (provider !== "github") return token;

        // Sign up
        await db.insert(usersTable).values({
          name: name,
          email: email.toLowerCase(),
          provider,
        });

        return token;
      },
    },
    pages: {
      signIn: "/auth",
      error: '/auth'
    },
});