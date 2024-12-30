import type { Role, User as PrismaUser, Status } from "@prisma/client";
import NextAuth from "next-auth";
import InputEmoji from "react-input-emoji-v2";
declare module "react-input-emoji-v2" {
  import * as React from "react";

  interface InputEmojiProps {
    value: string;
    onChange: (value: string) => void;
    cleanOnEnter?: boolean;
    onEnter?: (value: string) => void;
    placeholder?: string;
    keepOpened?: boolean;
    disableRecent?: boolean;
    onBlur?: () => void;
    onFocus?: () => void;
    shouldReturn?: boolean;
    customEmojis?: Array<{
      id: string;
      name: string;
      keywords: string[];
      skins: Array<{
        src: string;
      }>;
    }>;
  }

  const InputEmoji: React.FC<InputEmojiProps>;

  export default InputEmoji;
}
declare module "next-auth" {
  interface Session {
    user: Omit<PrismaUser, "password">;
  }

  interface User {
    id: string;
    role: Role;
    name: string;
    email: string;
    image: string;
    status: Status;
  }
}
