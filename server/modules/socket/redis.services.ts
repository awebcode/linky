import { loggerInstance } from "../../config/logger.config";
import { ensureRedisConnection, pubClient } from "../../config/redis.config";
const isOnlineR = async (userId: string) => {
  try {
    const status = await pubClient.get(`online_user:${userId}`);
    return !!status;
  } catch (error) {
    loggerInstance.error(`Error checking online status: ${userId}`, error);
    return false;
  }
}
// Redis services
const setUserOnline = async (userId: string) => {
  try {
    if(!userId) return
    await pubClient.setEx(`online_user:${userId}`, 120, "online");
    await pubClient.sAdd("online_users_set", userId);
  } catch (error) {
    loggerInstance.error(`Error setting user online: ${userId}`, error);
  }
};

const isUserOnline = async (userId: string): Promise<boolean> => {
  try {
    if(!userId) return false
    const status = await pubClient.get(`online_user:${userId}`);
    return !!status;
  } catch (error) {
    loggerInstance.error(`Error checking online status: ${userId}`, error);
    return false;
  }
};

const removeUserOnline = async (userId: string) => {
  try {
    if(!userId) return
    await pubClient.del(`online_user:${userId}`);
    await pubClient.sRem("online_users_set", userId);
  } catch (error) {
    loggerInstance.error(`Error removing user online status: ${userId}`, error);
  }
};

const getAllOnlineUsers = async (): Promise<string[]> => {
  try {
    // Before using Redis:
    await ensureRedisConnection();

    return await pubClient.sMembers("online_users_set");
  } catch (error) {
    loggerInstance.error("Error fetching all online users", error);
    return [];
  }
};

/**
 * Get all members of a specific room
 * @param {string} roomId - The ID of the room to get members for.
 * @returns {Promise<string[]>} - A promise that resolves to an array of user IDs.
 */
const getRoomMembersR = async (roomId: string) => {
  try {
    // Retrieve all members of the room from Redis
    const members = await pubClient.sMembers(`room:${roomId}`);
    return members;
  } catch (error) {
    loggerInstance.error(`Error fetching room members: ${roomId}`, error);
    return [];
  }
};
/**
 * Join a room for a specific user
 * @param {string} userId - The ID of the user to join the room for.
 * @param {string} roomId - The ID of the room to join.
 */
const joinRoomR = async (userId: string, roomId: string) => {
  try {
    await pubClient.sAdd(`room:${roomId}`, userId); // Add the user to the room`, roomId);
  } catch (error) {
    loggerInstance.error(`Error joining room for user ${userId}: ${roomId}`, error);
  }
};

/**
 * Leave a room for a specific user
 * @param {string} userId - The ID of the user to leave the room for.
 * @param {string} roomId - The ID of the room to leave.
 */
const leaveRoomR = async (userId: string, roomId: string) => {
  try {
    await pubClient.sRem(`room:${roomId}`, userId); // Remove the user from the room`, roomId);
  } catch (error) {
    loggerInstance.error(`Error leaving room for user ${userId}: ${roomId}`, error);
  }
};



export {isOnlineR, setUserOnline, isUserOnline, removeUserOnline, getAllOnlineUsers,getRoomMembersR, joinRoomR, leaveRoomR };