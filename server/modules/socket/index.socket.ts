import { Server, Socket } from "socket.io";
import http from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "../../config/redis.config";
import { handleSocketEvents } from "./handle.socket";
import { loggerInstance } from "../../config/logger.config"; // Logger for error tracking
import { AppError } from "../../middlewares/errors-handle.middleware";

let io: Server;

const initSocket = (server: http.Server) => {
  try {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      adapter: createAdapter(pubClient, subClient),
      perMessageDeflate: {
        threshold: 1024,
      },
      allowEIO3: true,
      transports: ["websocket", "polling", "webtransport"],
    });

    io.on("connection", (socket: Socket) => {
      try {
        handleSocketEvents(socket, io);
      } catch (err) {
        loggerInstance.error("Error handling socket event:", err);
        socket.emit("error", "An unexpected error occurred");
      }
    });

    io.on("error", (err) => {
      loggerInstance.error("Socket.IO server error:", err);
      throw new AppError("Socket.IO Initialization Error", 500); // Custom error
    });
  } catch (err) {
    loggerInstance.error("Error initializing Socket.IO:", err);
    throw new AppError("Socket.IO Initialization Failed", 500);
  }
};

export { initSocket, io };
