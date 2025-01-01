import express from "express";
import http from "http";
import { initSocket } from "./modules/socket/handle.socket";
import {
  errorHandler,
  NotFoundExceptionMiddleware,
} from "./middlewares/errors-handle.middleware";
import { envConfig } from "./config/env.config";
import mainRoutes from "./modules/index.routes";
import { setupMiddlewares } from "./middlewares/setup-middlewares"; // Import the middleware setup
import { availableParallelism } from "node:os";
import cluster from "node:cluster";
import {
  connectRedis,
  disconnectRedis,
  pubClient,
  subClient,
} from "./config/redis.config";
import prisma from "./libs/prisma";
import { loggerInstance } from "./config/logger.config";
import { initQueue } from "./modules/queue/index.queue";

// Create a cluster for horizontal scaling
if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  // Fork workers based on the number of CPUs (adjusting as needed)
  for (let i = 0; i < Math.floor(numCPUs / 3); i++) {
    // Adjust the number of workers as needed
    cluster.fork({
      PORT: Number(envConfig.port) + i, // Pass the port offset for each worker
    });
  }
} else {
  const app = express();
  const server = http.createServer(app);

  // Setup global middlewares
  setupMiddlewares(app);
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Linky Server is running" });
  });

  // Setup routes
  app.use("/api/v1", mainRoutes);

  // Connect to Redis (create clients for pub/sub)
  connectRedis();

  // Initialize Socket.IO with the server
  initSocket(server);
  
  // Initialize Queue
  initQueue();

  // Set up Redis adapter for scaling across workers
  // setupSocketAdapter(server);

  // Global error handling middlewares
  app.use(NotFoundExceptionMiddleware);
  app.use(errorHandler);

  // Start the server for each worker
  const port = process.env.PORT || envConfig.port;
  
  server.listen(port, () => {
    console.log(`Chat server is listening on http://localhost:${port}`);
  });

  // Shutdown the server gracefully
  process.on("SIGINT", async () => {
    loggerInstance.warn("Shutting down the server...");
    await prisma.$disconnect();
    await disconnectRedis();
    process.exit(0);
  });
}
