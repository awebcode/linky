import { Server, Socket } from "socket.io";
import http from "http";
import { Status } from "@prisma/client";
import { handleUserStatusCleanup } from "./socket.utils";
import * as chatService from "../chat/chat.services";
import { loggerInstance } from "../../config/logger.config";
import { pubClient, subClient } from "../../config/redis.config";
import { getUserStatus, setUserStatus } from "./redis.services";
import { createAdapter } from "@socket.io/redis-adapter";
import prisma from "../../libs/prisma";

let io: Server;
const initSocket = (server: http.Server) => {

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    adapter: createAdapter(pubClient, subClient),
    
  });

  io.on("connection", (socket: Socket) => {
    console.log("New socket connection", socket.id);

    // Handle user heartbeat
    socket.on("online", async ({ userId }) => {
      socket.data.userId = userId;
      if(!userId) return
      // Check if the user is online and update last active timestamp
      const userStatus = await getUserStatus(userId)
      if (!userStatus || userStatus.status === Status.OFFLINE) {
        // User is going online, set status to ONLINE in Redis
        await setUserStatus(userId, Status.ONLINE, Date.now());
        await prisma.user.update({
          where: { id: userId },
          data: { status: Status.ONLINE },
        });
        const onlineUsers = await chatService.getOnlineUsers(userId);
        // Broadcast to other users that this user is now online
        onlineUsers.forEach((user) => {
          io.to(user.id).emit("user_status_change", { userId, status: Status.ONLINE });
        });
      } else {
        // Update the last active timestamp for the online user
        await setUserStatus(userId, Status.ONLINE, Date.now());
      }
    });

    // Handle user disconnection and update their status to OFFLINE
    socket.on("disconnect", async () => {
      try {
        const userId = socket.data.userId;
        console.log({ disUserId: userId });

        // Check if user was already marked as online
        const userStatus = await getUserStatus(userId)

        if (userStatus && userStatus.status === Status.ONLINE) {
          // Mark the user as offline in Redis
          await setUserStatus(userId, Status.OFFLINE, Date.now());

          // Broadcast to others that this user is now offline
          io.emit("user_status_change", { userId, status: Status.OFFLINE });
        }
      } catch (error) {
        loggerInstance.error("Error during disconnection", error);
      }
    });
  });

  // Start user status cleanup to remove inactive users from Redis
  handleUserStatusCleanup(10000, io);

};

export { initSocket,io };
