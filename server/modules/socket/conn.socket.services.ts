import type { Status } from "@prisma/client";
import prisma from "../../libs/prisma";
import { fetchBatchAllOnlineUsersInUserChat } from "../chat/chat.utils";
import { io } from "./handle.socket";
import { AppError } from "../../middlewares/errors-handle.middleware";
// import { getRoomMembersR } from "./redis.services";

export const sentStatusChanged = async (userId: string, status: Status) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true, lastActive: true },
    });
    if (!user) return;
    // const roomMembers=await getRoomMembersR(userId)
    // Fetch all online users
    const onlineUsers = await fetchBatchAllOnlineUsersInUserChat(userId, 250); // Fetch in larger batches if possible

    // Map through online users to get their socket IDs
    const onlineUsersIds = onlineUsers.map((user) => {
      return user.id;
    });

    // Emit "user_status_changed" event to all relevant sockets
    io.to(onlineUsersIds).emit("user_status_changed", {
      ...user,
      id: userId, // Assuming the status change is for the current user
      status,
    });
  } catch (error) {
    throw new AppError("Error sending status change", 500);
  }
};
