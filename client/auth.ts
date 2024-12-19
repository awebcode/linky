import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import type { User } from "@prisma/client";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", required: true, placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return null;
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for sessions
  },

  callbacks: {
    // Callback for JWT token
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    // Callback for session to include user details in the session
    async session({ session, token }) {
      if (token) {
        session.user = token.user as User
      }
      return session;
    },
  },
});
