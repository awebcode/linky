import { createClient } from "redis";
import { loggerInstance } from "./logger.config";

// Redis URL setup (ensure it's correct)
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Create Redis clients
const pubClient = createClient({
  url: redisUrl,
  socket: {
  
    reconnectStrategy: (retries) => Math.min(retries * 50, 5000), // Retry after delays
  },
});
const subClient = pubClient.duplicate(); // Use a duplicate client for subscriber

// Redis connection status flag
let isRedisConnected = false;

// Setup event listeners before connecting
pubClient.on("connect", () => {
  loggerInstance.info("Redis publisher connected successfully");
  isRedisConnected = true;
});

pubClient.on("error", (err) => {
  loggerInstance.error("Redis publisher connection error:", err);
  isRedisConnected = false; // Mark Redis as disconnected
});

pubClient.on("end", () => {
  loggerInstance.warn("Redis publisher connection closed");
  isRedisConnected = false;
  // Attempt to reconnect if the connection is closed
  reconnectRedis();
});

subClient.on("connect", () => {
  loggerInstance.info("Redis subscriber connected successfully");
});

subClient.on("error", (err) => {
  loggerInstance.error("Redis subscriber connection error:", err);
});

subClient.on("end", () => {
  loggerInstance.warn("Redis subscriber connection closed");
  // Attempt to reconnect if the connection is closed
  reconnectRedis();
});

// Reconnect function for Redis clients
const reconnectRedis = async () => {
  if (!isRedisConnected) {
    try {
      await connectRedis();
      loggerInstance.info("Reconnected to Redis successfully.");
    } catch (error) {
      loggerInstance.error("Failed to reconnect to Redis:", error);
    }
  }
};

// Function to connect to Redis clients
const connectRedis = async () => {
  try {
    if (!isRedisConnected) {
      await Promise.all([pubClient.connect(), subClient.connect()]);
      loggerInstance.info("Redis clients connected successfully.");
    }
  } catch (error) {
    loggerInstance.error("Error connecting Redis clients:", error);
  }
};

// Function to ensure Redis clients are connected before usage
const ensureRedisConnection = async () => {
  if (!isRedisConnected) {
    loggerInstance.info("Reconnecting Redis clients...");
    await connectRedis();
  }
};

// Gracefully handle Redis client shutdown
const disconnectRedis = async () => {
  try {
    if (isRedisConnected) {
      await pubClient.quit();
      await subClient.quit();
      loggerInstance.info("Redis clients disconnected successfully.");
    }
  } catch (error) {
    loggerInstance.error("Error disconnecting Redis clients:", error);
  }
};

// Exporting Redis clients and functions
export { pubClient, subClient, connectRedis, ensureRedisConnection, disconnectRedis };
