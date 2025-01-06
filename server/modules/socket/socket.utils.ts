import prisma from "../../libs/prisma";
import { loggerInstance } from "../../config/logger.config";
import type { Status } from "@prisma/client";

/**
 * Check if a value is falsy.
 * @param value - The value to check.
 * @returns {boolean} - True if the value is falsy, false otherwise.
 */
export function isFalsy(value: any) {
  return value == null || value === false || value === 0 || value === "" || value === undefined || Number.isNaN(value);
}

/**
 * @description Update the user status in the database
 * @param userId 
 * @param status 
 * @returns 
 */
export const updateDatabaseUserStatus = async (userId: string, status: Status) => {
  try {
    // Return early if userId or status is falsy (null, undefined, empty string)
    if (isFalsy(userId) || isFalsy(status)) {
      return null;
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: { name: true, image: true, lastActive: true },
    });
    return user;
  } catch (error) {
    loggerInstance.error(`Error updating user status: ${userId}`, error);
    // throw new AppError("Error updating user status", 500);
  }
};
