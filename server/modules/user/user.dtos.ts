import { z } from "zod";
import { Role } from "@prisma/client";

const UserBaseSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(3, "name must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  image: z.string().optional(),
  providerId: z.string().optional(),
  role: z.nativeEnum(Role).optional(), // Enum validation using Zod's `nativeEnum`
});

export const RegisterSchema = UserBaseSchema.pick({
  email: true,
  name: true,
  password: true,
});

export const LoginSchema = UserBaseSchema.pick({
  email: true,
  password: true,
});

export const UpdateUserSchema = UserBaseSchema.partial({
  email: true,
  name: true,
  image: true,
  role: true,
  password: true,
});

export const generateResetTokenSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(6, "Token must be at least 6 characters long"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
export type LoginDTO = z.infer<typeof LoginSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
