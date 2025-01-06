import { Status } from "@prisma/client";
export interface UserSessionResponse {
  id: string;
  role: string;
  name: string;
  email: string;
  image?: string; // Optional field
  status: string;
}

export interface UnlistedUser {
  id: string;
  name: string;
  email: string;
  image: string;
  status: Status;
  lastActive: Date;
}

export interface TypingUser extends UnlistedUser {
  chatId: string;
}