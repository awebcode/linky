"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const loginUser = async (email: string, password: string) => {
  try {
    return await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) throw new AuthError(error.message.split(".")[0]);
    throw new Error("Something went wrong");
  }
};
