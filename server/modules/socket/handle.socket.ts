// socket/socket.events.ts
import { Socket, Server } from "socket.io";
import { Status } from "@prisma/client";
import { isOnlineR, setUserOnline, removeUserOnline } from "./redis.services";
import { getOnlineConversationIdsByUserId } from "./conn.socket.services";
import { loggerInstance } from "../../config/logger.config";
import { SocketEvents } from "./socket.events";
import { isFalsy, updateDatabaseUserStatus } from "./socket.utils";
import type { z } from "zod";
import { createMessageForSocket } from "./db.socket";
import type { CreateSocketMessageSchema } from "./dtos.socket";
import { handleMessage, handleStartTyping, handleStopTyping } from "./message.socket";

const BatchSize = 250;

/**
 * Handle a new connection event.
 * @param socket - The connected Socket instance.
 * @param io - The Socket.io Server instance.
 */
export const handleSocketEvents = (socket: Socket, io: Server) => {
  const userId = socket.handshake.query.userId as string;
  // Early exit if userId is invalid
  if (isFalsy(userId)) {
    return; // Exit early if userId is invalid
  }
  socket.on(SocketEvents.HEART_BEAT, () => handleHeartbeat(userId));
  socket.on(SocketEvents.MESSAGE_SENT, (data) => handleMessage(data, io));
  socket.on(SocketEvents.USER_START_TYPING, (data) => handleStartTyping(data, socket));
  socket.on(SocketEvents.USER_STOP_TYPING, (data) => handleStopTyping(data, socket));
  socket.on("disconnect", () => handleDisconnect(userId, socket, io));

  initializeUserConnection(userId, socket, io);
};

const initializeUserConnection = async (userId: string, socket: Socket, io: Server) => {
  try {
    console.log("New user connected:", userId);

    // Check if user is already online (in memory or via a quick lookup)
    const isOnline = await isOnlineR(userId); // Maybe optimize by checking in memory first

    if (userId && !isOnline) {
      // Set user status to ONLINE in database
      await setUserOnline(userId);
      const user = await updateDatabaseUserStatus(userId, Status.ONLINE);

      // Fetch online conversation IDs the user is part of
      const onlineConversationIds = await getOnlineConversationIdsByUserId(userId);

      // Prevent re-joining the same room by checking socket's current rooms
      const userRooms = Object.keys(socket.rooms);

      // Join chat rooms in batches
      for (let i = 0; i < onlineConversationIds.length; i += BatchSize) {
        const chunk = onlineConversationIds.slice(i, i + BatchSize);

        // Join the chat room only if the socket is not already in the room
        for (let chatId of chunk) {
          if (!userRooms.includes(chatId)) {
            socket.join(chatId);
          }
        }

        // Emit USER_ONLINE event to the room
        socket.to(chunk).emit(SocketEvents.USER_ONLINE, {
          user: {
            ...user,
            id: userId,
            status: Status.ONLINE, // Make sure the status is ONLINE
          },
        });
      }
    }
  } catch (error) {
    loggerInstance.error("Error initializing user connection:", error);
  }
};

/**
 * Handle user heartbeat.
 */
const handleHeartbeat = async (userId: string) => {
  if (userId) {
    try {
      await setUserOnline(userId);
      console.log(`User ${userId} heartbeat received and updated.`);
    } catch (error) {
      loggerInstance.error(`Error updating heartbeat for user ${userId}`, error);
    }
  }
};

/**
 * Handle user disconnection and remove them from inactive rooms.
 */
const handleDisconnect = async (userId: string, socket: Socket, io: Server) => {
  if (isFalsy(userId)) {
    loggerInstance.warn("User ID not provided for disconnect event");
    return true;
  }

  try {
    const isOnline = await isOnlineR(userId);

    if (!isOnline) {
      // Remove user from online tracking (if you have a cache like Redis, update it here)
      await removeUserOnline(userId);

      // Update user's status to OFFLINE in the database
      const user = await updateDatabaseUserStatus(userId, Status.OFFLINE);

      // Fetch all online conversation IDs for the user
      const onlineConversationIds = await getOnlineConversationIdsByUserId(userId);

      // Join chat rooms in batches
      for (let i = 0; i < onlineConversationIds.length; i += BatchSize) {
        const chunk = onlineConversationIds.slice(i, i + BatchSize);

        socket.to(chunk).emit(SocketEvents.USER_OFFLINE, {
          user: { ...user, id: userId, status: Status.OFFLINE },
        }); // Notify others in the room
      }

      // // Optionally, log the disconnect event with more detailed information
      console.log(
        `User ${userId} disconnected and removed from ${Object.keys(socket.rooms).length
        } active rooms.`
      );
    }
  } catch (error) {
    loggerInstance.error(`Error handling disconnect for user ${userId}:`, error);
  }
};
