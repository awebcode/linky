import type { Role, User as PrismaUser } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: Omit<PrismaUser, "password">;
  }

  interface User {
    id: string;
    role: Role;
  }
}
