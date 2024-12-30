import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import prisma from "../../libs/prisma";
import { AppError } from "../../middlewares/errors-handle.middleware";
import type { Request } from "express";
import { envConfig } from "../../config/env.config";
import { sendEmail } from "../../config/mailer.config";
import {  generateResetTokenSchema, LoginSchema, RegisterSchema, resetPasswordSchema, UpdateUserSchema } from "./user.dtos";
import { deleteFile, uploadSingleFile } from "../../config/cloudinary.config";
import * as userUtility from "./user.utils";
import { generateRandomAvatar } from "../chat/chat.utils";

/**
 * User Operations
 */

// Register a new user
const createUser = async (req: Request) => {
  const { name, email, password } = RegisterSchema.parse(req.body);
  

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }
  
  const image = req.file
    ? await uploadSingleFile(req)
    : generateRandomAvatar(name);

  return prisma.user.create({
    data: { name, email, password: await userUtility.generateHash(password), image:typeof image === 'string' ? image : image.secure_url },
  });
};

// Login an existing user
const loginUser = async (req: Request) => {
  const { email, password } = LoginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password as string))) {
    throw new AppError("Invalid credentials", 401);
  }
  const tokenPayload = { id: user.id, role: user.role };
  const accessToken =  userUtility.generateToken(tokenPayload, "1h", "access");
  // const refreshToken =  generateToken(tokenPayload, "7d", "refresh");
  return {
    user: userUtility.userResponse(user),
    accessToken,
    // ...formatTokens(accessToken, refreshToken)
  };
};

// Get user by ID
const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return userUtility.userResponse(user);
};

// Verify user email
const verifyUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id: id } });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (user.verified) {
    throw new AppError("User already verified", 400);
  }

  return await prisma.user.update({ where: { id: id }, data: { verified: true } });
};

// Update user information
const updateUser = async (req: Request) => {
  const id = req.user.id;
  const data = UpdateUserSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { id: id } });

  if (req.file && user) {
    await deleteFile(user.image);
    const result = await uploadSingleFile(req);
    data.image = result.secure_url;
  }
  if (data.password) {
    data.password = await userUtility.generateHash(data.password as string);
  }

  if (data.email) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser && existingUser.id !== id) {
      throw new AppError("Email already exists", 400);
    }
  }
  return await prisma.user.update({ where: { id: id }, data });
};

/**
 * Password Reset Operations
 */

// Generate reset token for password recovery
const generateResetToken = async (req: Request) => {
  const { email } = generateResetTokenSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("User does not exist", 404);
  }

  const token = randomBytes(32).toString("hex");
  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour expiry
    },
  });

  const link = `${envConfig.clientUrl}/reset-password?token=${token}`;
  await sendEmail(
    email,
    user.name || "User",
    "Reset Your Password",
    `Click the link below to reset your password: ${link}`,
    link
  );

  return email
};

// Reset the user's password
const resetPassword = async (req: Request) => {
  const { token, newPassword } = resetPasswordSchema.parse(req.body);
  const user = await prisma.user.findFirst({ where: { resetToken: token } });
  if (!user || (user.resetTokenExpiry && user.resetTokenExpiry < new Date())) {
    throw new AppError("Invalid or expired token", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
  });
};
/**Admin Services */

const getUsers = async () => {
  return await prisma.user.findMany();
};
const deleteUsers = async () => {
  return await prisma.user.deleteMany();
};
// Exporting all services
export {
  createUser,
  loginUser,
 
  verifyUser,
  updateUser,
 
  generateResetToken,
  resetPassword,
  getUserById,
  getUsers,
  deleteUsers,
};
