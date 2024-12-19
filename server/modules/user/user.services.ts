import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import prisma from "../../libs/prisma";
import { AppError } from "../../middlewares/errors-handle.middleware";
import type { Request, Response } from "express";
import type { Role, User } from "@prisma/client";
import { envConfig } from "../../config/env.config";
import { getCookieOptions } from "../../config/cookie.config";
import { sendEmail } from "../../config/mailer.config";
import { type LoginDTO, type RegisterDTO, UpdateUserSchema } from "./user.dtos";
import { deleteFile, uploadSingleFile } from "../../config/cloudinary.config";

/**
 * Utility Functions
 */

// Generate hashed password
const generateHash = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

/** Generate JWT token
 * @param {object} payload - Payload for the token
 * @param {string} expiresIn - Expiration time for the token
 * @param {string} type - Type of token (access or refresh)
 * @returns {string} - JWT token
 */
const generateToken = async (
  payload: { id: string; role: Role },
  expiresIn: string,
  type: "access" | "refresh"
) => {
  const secret = type === "access" ? envConfig.jwtSecret : envConfig.refreshTokenSecret;
  return jwt.sign(payload, secret, { expiresIn });
};

// Verify JWT token
const verifyToken = async (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }
};

// Format tokens for response
const formatTokens = (accessToken: string, refreshToken: string) => ({
  accessToken,
  refreshToken,
  expiresAccessTokenAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  expiresRefreshTokenAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
});

// Format user data for response
const userResponse = (user: User) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  status: user.status,
  lastSeenAt: user.lastSeenAt,
  createdAt: user.createdAt,
});

/**  Set cookies on the client
  - access_token: 1 hour
  - refresh_token: 7 days
  @param {Response} res, accessToken, refreshToken
*/
const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie("access_token", accessToken, getCookieOptions(60 * 60)); // 1 hour
  res.cookie("refresh_token", refreshToken, getCookieOptions(60 * 60 * 24 * 7)); // 7 days
};

// Clear cookies on the client
const clearCookies = (res: Response) => {
  res.cookie("access_token", "", getCookieOptions(0));
  res.cookie("refresh_token", "", getCookieOptions(0));
};

/**
 * User Operations
 */

// Register a new user
const createUser = async ({ username, email, password, avatar }: RegisterDTO) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  return prisma.user.create({
    data: { username, email, password: await generateHash(password), avatar },
  });
};

// Login an existing user
const loginUser = async ({ email, password }: LoginDTO) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid credentials", 401);
  }
  const tokenPayload = { id: user.id, role: user.role };
  const accessToken = await generateToken(
    tokenPayload,
    "1h",
    "access"
  );
  const refreshToken = await generateToken(
    tokenPayload,
    "7d",
    "refresh"
  );
  return { user: userResponse(user), ...formatTokens(accessToken, refreshToken) };
};

// Get user by ID
const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return userResponse(user);
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
    await deleteFile(user.avatar);
    const result = await uploadSingleFile(req);
    data.avatar = result.secure_url;
  }
  if (data.password) {
    data.password = await generateHash(data.password as string);
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
const generateResetToken = async (email: string) => {
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

  const link = `${envConfig.clientUrl}/reset-password/${token}`;
  await sendEmail(
    email,
    user.username || "User",
    "Reset Your Password",
    `Click the link below to reset your password: ${link}`,
    link
  );
};

// Reset the user's password
const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { resetToken: token } });
  if (!user || (user.resetTokenExpiry && user.resetTokenExpiry < new Date())) {
    throw new AppError("Invalid or expired token", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { resetToken: token },
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
  generateToken,
  verifyToken,
  verifyUser,
  updateUser,
  formatTokens,
  userResponse,
  setCookies,
  clearCookies,
  generateResetToken,
  resetPassword,
  getUserById,
  generateHash,
  getUsers,
  deleteUsers,
};
