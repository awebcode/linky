import { PrismaClient } from "@prisma/client";
import { loggerInstance } from "../config/logger.config";

// In-memory cache for storing model's update timestamps
const updatedAtCache: { [chatId: string]: { updatedAt: string; timestamp: number } } = {};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Initialize PrismaClient (singleton in development)
const prisma = globalForPrisma.prisma || new PrismaClient();

// List of models to track
const MODELS = ["Chat", "Message", "Media", "Reaction", "MessageSeen"];
const CACHE_EXPIRATION_TIME = 20 * 1000; // 20 seconds in milliseconds

// Middleware for handling the update of `updatedAt` in related models
prisma.$use(async (params, next) => {
  // Check if the model is in the allowed list and the action is "create" or "update"
  if (
    MODELS.includes(params.model as string) &&
    ["create", "update"].includes(params.action)
  ) {
    // Dynamically fetch the `chatId` based on the model type and arguments
    const chatId =
      params.args.data?.chatId ||
      params.args.data?.message?.chatId || // For models like Message, Reaction
      params.args.data?.media?.chatId; // Add other nested fields here if needed

    // Proceed only if chatId is available
    if (chatId) {
      try {
        // Check if the chatId is already cached with a recent update time
        const cachedData = updatedAtCache[chatId];
        const currentTimestamp = Date.now();

        if (cachedData) {
          // If cached value exists and the cache is not expired (older than 20 sec), skip updating
          if (currentTimestamp - cachedData.timestamp < CACHE_EXPIRATION_TIME) {
            console.log(`Skipping update for chatId: ${chatId}, cache is still valid.`);
            return next(params); // Skip updating `updatedAt` in this case
          }
        }

        // Perform the query and capture the result
        const result = await next(params);

        // Check if the model is one of the message-related models
        if (
         MODELS.includes(params.model as string)
        ) {
          // Avoid unnecessary writes: check if the updatedAt value has changed
          await prisma.chatMember.updateMany({
            where: { chatId },
            data: { updatedAt: new Date() },
          });

          // Update the cache with the new `updatedAt` value and current timestamp
          updatedAtCache[chatId] = {
            updatedAt: new Date().toISOString(),
            timestamp: currentTimestamp,
          };
        }

        return result;
      } catch (error) {
        // Log the error for monitoring
        console.error("Error in Prisma middleware:", error);
        loggerInstance.error("Error in Prisma middleware:", error);
        throw error; // Re-throw to ensure the operation fails
      }
    } else {
      // Handle missing chatId gracefully, avoid throwing errors
      loggerInstance.warn("chatId missing in the params for model:", params.model);
    }
  }

  // Proceed with the original Prisma query if no specific action needed
  return next(params);
});

export default prisma;

// Persist PrismaClient in development for hot-reloading
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
