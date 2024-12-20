import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import axiosInstance from "./config/axiosInstance";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Authenticate user via an external API
        const { data } = await axiosInstance.post("/auth/login", {
          email: credentials.email,
          password: credentials.password,
        });

        return data?.user || null; // Return the user object or null
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for sessions
  },
  callbacks: {
    async jwt({ token, user }) {
      // Include user ID in the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        // Fetch user data from the database
        const user = await prisma.user.findUnique({ where: { id: token.id as string } });
        if (user) session.user = user;
      }
      return session;
    },
  },
  jwt: {
    encode: async ({ token, secret, maxAge = 30 * 24 * 60 * 60 }) => {
      const payload = { ...token, exp: Math.floor(Date.now() / 1000) + maxAge };
      return jwt.sign(payload, secret as string);
    },
    decode: async ({ token, secret }) => {
      return jwt.verify(token as string, secret as string) as { [key: string]: any };
    },
  },
  cookies: {
    sessionToken: {
      name: "access_token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
        priority: "high",
      },
    },
  },
});
