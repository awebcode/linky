import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as jose from "jose";
import type { JwtPayload } from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to encode a JWT
export const encodeJwt = async ({
  payload,
  secret,
  expires = "30d",
}: {
  payload: JwtPayload;
  secret: string;
  expires?: string;
}) => {
  const secretKey = new TextEncoder().encode(secret);
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(secretKey);
};

// Utility function to decode and verify a JWT
export const verifyJwt = async ({ token, secret }: { token: string; secret: string }) => {
  if (!token || !secret) return null;
  const secretKey = new TextEncoder().encode(secret);
  try {
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload
  } catch (error) {
    return null; // In case of verification failure
  }
};
