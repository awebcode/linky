import type { Role, User as PrismaUser } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: PrismaUser;
  }

  interface User {
    id: string;
    role: Role;
  }
}
