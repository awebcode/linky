import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { AppError } from "./errors-handle.middleware";
import { envConfig } from "../config/env.config";
import type { Role } from "@prisma/client";
import * as userService from "../modules/user/user.services";
const tokenCache = new Map<string, JwtPayload>();
interface UserJwtPayload extends JwtPayload {
  id: string;
  role: Role;
}
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = extractTokenFromCookies(req, "access_token");
    if (!accessToken) {
      throw new AppError("Please login to continue!", 401);
    }
    // Use cached token if available
    if (accessToken && tokenCache.has(accessToken)) {
      req.user = tokenCache.get(accessToken) as UserJwtPayload;
      return next();
    }

    const decoded = jwt.verify(accessToken, envConfig.jwtSecret) as UserJwtPayload;
    tokenCache.set(accessToken, decoded);
    req.user = decoded;
    return next();

    // Refresh token logic
    // const refreshToken = extractTokenFromCookies(req, "refresh_token");

    // if (!refreshToken || !isTokenValid(refreshToken, envConfig.refreshTokenSecret)) {
    //   throw new AppError("Please login to continue!", 401);
    // }
    // const refreshTokenPayload = jwt.verify(
    //   refreshToken,
    //   envConfig.refreshTokenSecret
    // ) as UserJwtPayload;

    // const { exp, ...tokenPayloadWithoutExp } = refreshTokenPayload;

    // const newAccessToken = await userService.generateToken(
    //   tokenPayloadWithoutExp,
    //   "1h",
    //   "access"
    // );
    // const newRefreshToken = await userService.generateToken(
    //   tokenPayloadWithoutExp,
    //   "7d",
    //   "refresh"
    // );

    // userService.setCookies(res, newAccessToken, newRefreshToken);

    // tokenCache.set(newAccessToken, refreshTokenPayload);
    // req.user = refreshTokenPayload;
    // next();
  } catch (error) {
    next(error);
  }
};

// Helper functions
const extractTokenFromCookies = (req: Request, tokenName: string): string | null => {
  return req.cookies[tokenName] || req.headers.authorization?.split(" ")[1] || null;
};

const isTokenValid = (token: string, secret: string): boolean => {
  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
};

// Roles middleware with RequestHandler type
export const rolesMiddleware = (allowedRoles: Role[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("Forbidden. You do not have the required privileges or roles.", 403)
      );
    }

    next(); // User has one of the allowed roles, proceed to the next middleware/route handler
  };
};
