import { z } from "zod";
import { Role } from "@prisma/client";

const UserBaseSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  avatar: z.string().optional(),
  providerId: z.string().optional(),
  role: z.nativeEnum(Role).optional(), // Enum validation using Zod's `nativeEnum`
});

export const RegisterSchema = UserBaseSchema.pick({
  email: true,
  username: true,
  password: true,
  avatar: true,
});

export const LoginSchema = UserBaseSchema.pick({
  email: true,
  password: true,
});

export const UpdateUserSchema = UserBaseSchema.partial({
  email: true,
  username: true,
  avatar: true,
  role: true,
  password:true
});

export const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
})

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
export type LoginDTO = z.infer<typeof LoginSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
export type ForgetPasswordDTO = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;