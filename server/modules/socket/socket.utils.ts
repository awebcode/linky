import type { Server } from "socket.io";
import prisma from "../../libs/prisma";
import { Status } from "@prisma/client";
import { getUserStatuses, deleteUserStatus, } from "./redis.services";

/**
 * Util function to handle user status cleanup
 * @param updateInterval
 * @param io
 */
export const handleUserStatusCleanup = (updateInterval: number, io: Server) => {
  setInterval(async () => {
    const now = Date.now();
    const users = await getUserStatuses();

    const offlineUpdates = [];
    for (const { userId, status, lastActive } of users) {
      if (now - lastActive > updateInterval && status === Status.ONLINE) {
        offlineUpdates.push({
          id: userId,
          status: Status.OFFLINE,
          lastActive: new Date(lastActive),
        });

        // Remove offline user from Redis
        await deleteUserStatus(userId);

        // Emit event to notify clients
        io.emit("user_status_change", { userId, status: Status.OFFLINE });
      }
    }

    // Batch update users' statuses in the database
    if (offlineUpdates.length > 0) {
      await Promise.all(
        offlineUpdates.map(({ id, status, lastActive }) =>
          prisma.user.update({
            where: { id },
            data: { status, lastActive },
          })
        )
      );
    }
  }, updateInterval); // Cleanup every 'updateInterval' milliseconds
};
