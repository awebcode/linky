import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../middlewares/errors-handle.middleware";
import type { Response } from "express";
import type { Role, User } from "@prisma/client";
import { envConfig } from "../../config/env.config";
import { getCookieOptions } from "../../config/cookie.config";


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
const generateToken = (
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
  name: user.name,
  email: user.email,
  image: user.image,
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

export {
  generateHash,
  generateToken,
  verifyToken,
  formatTokens,
  userResponse,
  setCookies,
  clearCookies,
};
