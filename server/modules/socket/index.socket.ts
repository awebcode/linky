// socket/index.ts
import { Server, Socket } from "socket.io";
import http from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "../../config/redis.config";
import { handleSocketEvents } from "./handle.socket";

let io: Server;

/**
 * Initialize the Socket.io server with Redis adapter.
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
      threshold: 1024, // Compress messages larger than 1 KB
    },
    allowEIO3: true, // Enable support for EIO 3
    transports: ["websocket", "polling", "webtransport"],
  });

  io.on("connection", (socket: Socket) => handleSocketEvents(socket, io));
};

export { initSocket, io };
