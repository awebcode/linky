import { Server, Socket } from "socket.io";
import http from "http";
import { Status } from "@prisma/client";

import { loggerInstance } from "../../config/logger.config";
import { pubClient, subClient } from "../../config/redis.config";
import { createAdapter } from "@socket.io/redis-adapter";
import prisma from "../../libs/prisma";
import { isOnlineR, removeUserOnline, setUserOnline } from "./redis.services";
import { sentStatusChanged } from "./conn.socket.services";
import { disconnect } from "process";
let io: Server;

/**
 * Initialize the Socket.io server with Redis adapter and necessary event listeners.
 * @param {http.Server} server - The HTTP server to attach the WebSocket server to.
 */
const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    adapter: createAdapter(pubClient, subClient),
    perMessageDeflate: {
      threshold: 1024, // Only compress messages larger than 1 KB
    },
    allowEIO3: true, // Enable support for EIO 3
    transports: ["websocket", "polling", "webtransport"],
  });

  io.on("connection", (socket: Socket) => {
    console.log("New socket connection", socket.id);
    const userId = socket.handshake.query.userId as string;

    // Handle user heartbeat to keep the socket active
    socket.on("heartbeat", async () => {
      if (userId) {
        try {
          // Update the user's online status in Redis
          await setUserOnline(userId);
          console.log(`User ${userId} heartbeat received and updated.`);
        } catch (error) {
          loggerInstance.error(`Error updating heartbeat for user ${userId}`, error);
        }
      }
    });

    // Handle user going online
    socket.on("user-online", async ({ userId }: { userId: string }) => {
      if (!userId) {
        loggerInstance.warn("User ID not provided for online event");
        return;
      }

      try {
        // Check if the user is already online
        const isOnline = await isOnlineR(userId);
        if (!isOnline) {
          // User is going online for the first time, store user-to-socket mapping
          await setUserOnline(userId);
          await prisma.user.update({
            where: { id: userId },
            data: { status: Status.ONLINE },
          });
          // Notify other users about the user's online status
          await sentStatusChanged(userId, Status.ONLINE);
        }
      } catch (error) {
        loggerInstance.error(`Error handling online event for user ${userId}`, error);
      }
    });

    // Handle user disconnection
    socket.on("disconnect", async () => {
      if (!userId) {
        loggerInstance.warn("User ID not provided for disconnect event");
        return;
      }

      try {
        // Remove user-to-socket mapping from Redis and update database status to offline
        await removeUserOnline(userId);
        await prisma.user.update({
          where: { id: userId },
          data: { status: Status.OFFLINE },
        });

        // Notify other users about the user's offline status
        io.emit("user_status_changed", { userId, status: Status.OFFLINE });

        console.log(`User ${userId} disconnected and status updated.`);
      } catch (error) {
        loggerInstance.error(`Error handling disconnect for user ${userId}`, error);
      }
    });
  });
};

export { initSocket, io };
