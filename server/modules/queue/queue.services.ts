import { Status } from "@prisma/client";
import prisma from "../../libs/prisma";
import { getAllOnlineUsers } from "../socket/redis.services";
import { loggerInstance } from "../../config/logger.config";

const PAGE_SIZE = 100; // Number of users to fetch per batch

// Function to fetch users with pagination using cursor-based pagination
const fetchDbOnlineUsers = async (cursor?: string) => {
  return await prisma.user.findMany({
    where: { status: Status.ONLINE },
    select: { id: true },
    skip: cursor ? 1 : 0, // Skip the cursor if it's not the first batch
    take: PAGE_SIZE, // Fetch in batches of PAGE_SIZE
    cursor: cursor ? { id: cursor } : undefined, // Use cursor for pagination
  });
};

// Background task to sync Redis with DB
export const syncOfflineUsers = async () => {
  let cursor: string | undefined = undefined;
  let isDone = false;
  let totalProcessed = 0;

  while (!isDone) {
    // Fetch online users from Redis
    const onlineUsers = await getAllOnlineUsers();

    // Fetch a batch of online users from the database
    const dbOnlineUsers = await fetchDbOnlineUsers(cursor);

    if (dbOnlineUsers.length === 0) {
      isDone = true;
      break; // No more users to process, exit the loop
    }

    // Update the cursor for the next batch of users
    cursor = dbOnlineUsers[dbOnlineUsers.length - 1].id;

    // Get the IDs of the online users from the database
    const dbUserIds = dbOnlineUsers.map((user) => user.id);

    // Find offline users by comparing with the Redis online users
    const offlineUsers = dbUserIds.filter((id) => !onlineUsers.includes(id));

    // Update the status of offline users in the database
    if (offlineUsers.length > 0) {
      await prisma.user.updateMany({
        where: {
          id: { in: offlineUsers },
        },
        data: { status: Status.OFFLINE },
      });
    }

    totalProcessed += dbOnlineUsers.length;
    loggerInstance.info(`Processed ${totalProcessed} users so far...`);
  }

  loggerInstance.info(`Sync completed. Total users processed: ${totalProcessed}`);
};
