import { createClient } from "redis";
import { loggerInstance } from "./logger.config";

// Redis URL setup (ensure it's correct)
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Create Redis clients
const pubClient = createClient({ url: redisUrl });
const subClient = pubClient.duplicate();

// // Setup event listeners before connecting
// pubClient.on("connect", () => {
//   loggerInstance.info("Redis publisher connected successfully");
// });
pubClient.on("error", (err) => {
  loggerInstance.error("Redis publisher connection error:", err);
});
// subClient.on("connect", () => {
//   loggerInstance.info("Redis subscriber connected successfully");
// });
subClient.on("error", (err) => {
  loggerInstance.error("Redis subscriber connection error:", err);
});

// Connect Redis clients
const connectRedis = async () => {
  try {
    await Promise.all([pubClient.connect(), subClient.connect()]);
    loggerInstance.info("Redis clients connected successfully.");
  } catch (error) {
    loggerInstance.error("Error connecting Redis clients:", error);
  }
};



// Exporting clients for other usage
export { pubClient, subClient, connectRedis };
