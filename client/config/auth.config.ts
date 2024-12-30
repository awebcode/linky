import { AuthError, type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import axiosInstance from "./axiosInstance";
import { encodeJwt, verifyJwt } from "@/lib/utils";

export default {
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        try {
          // Authenticate user via an external API
          const { data } = await axiosInstance.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          return data?.user || null; // Return the user object or null
        } catch (error: any) {
          throw new AuthError(
            error.response?.data?.message || "Something went wrong on the server"
          );
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Include user ID in the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      // Map all token properties to session.user
      if (token) {
        session.user = {
          ...token, // Spread all properties from the token
        } as any;
      }
      return session;
    },
  },
  jwt: {
    encode: async ({ token, secret }) => {
      const payload = {
        id: token?.id,
        name: token?.name,
        email: token?.email,
        image: token?.image,
        role: token?.role,
        status: token?.status,
      };
      return await encodeJwt({ payload, secret: secret as string });
    },
    decode: async ({ token, secret }) => {
      return await verifyJwt({ token: token as string, secret: secret as string });
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
  pages: {
    error: "/auth/error",
  },
  logger: {
    error: () => {}, // Disable error logging
    warn: () => {}, // Disable warnings
    debug: () => {}, // Disable debug logs
  },
} satisfies NextAuthConfig;
