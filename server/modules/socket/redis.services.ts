import { loggerInstance } from "../../config/logger.config";
import { pubClient } from "../../config/redis.config";

// Function to set user status in Redis
export const setUserStatus = async (
  userId: string,
  status: string,
  lastActive: number
) => {
  try {
    if (!userId) return; 
    await pubClient.hSet("user_status", userId, JSON.stringify({ status, lastActive }));
  } catch (error) {
    loggerInstance.error(`Error setting user status for ${userId}`, error);
  }
};
// Function to get a user's status from Redis
export const getUserStatus = async (userId: string) => {
  if(!userId) return 
  
  try {
    const status = await pubClient.hGet("user_status", userId);
    return status ? JSON.parse(status) : null;
  } catch (error) {
    loggerInstance.error(`Error fetching user status for ${userId}`, error);
    return null;
  }
}

// Function to get all user statuses from Redis
export const getUserStatuses = async () => {
  try {
    const users = await pubClient.hGetAll("user_status");
    return Object.entries(users).map(([userId, data]) => ({
      userId,
      ...JSON.parse(data),
    }));
  } catch (error) {
    loggerInstance.error("Error fetching user statuses", error);
    return [];
  }
};

// Function to delete a user's status in Redis
export const deleteUserStatus = async (userId: string) => {
  try {
    await pubClient.hDel("user_status", userId);
  } catch (error) {
    loggerInstance.error(`Error deleting user status for ${userId}`, error);
  }
};

//update user status in Redis
export const updateUserStatus = async (
  userId: string,
  status: string,
  lastActive: number
) => {
  try {
    await pubClient.hSet("user_status", userId, JSON.stringify({ status, lastActive }));
  } catch (error) {
    loggerInstance.error(`Error updating user status for ${userId}`, error);
  }
};