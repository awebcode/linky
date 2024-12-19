import type { CookieOptions as ExpressCookieOptions } from "express";
import { envConfig } from "./env.config";

const baseCookieOptions: ExpressCookieOptions = {
  httpOnly: true,
  secure: envConfig.nodeEnv === "production", // Use HTTPS in production
  signed: true, // Enable signed cookies for integrity
  path: "/", // Cookie is available across the entire domain
  maxAge: 60 * 60 * 1000, // Default to 1 hour (milliseconds)
  priority: "high", // High priority for cookies, useful for session cookies
  sameSite: "strict", // Or "Lax" for stricter cookie security
  encode: (value) => Buffer.from(value).toString("base64"),
};

export const getCookieOptions = (maxAge: number): ExpressCookieOptions => ({
  ...baseCookieOptions,
  maxAge: maxAge * 1000, // Convert seconds to milliseconds
});
