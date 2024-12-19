// socket/socketHandler.ts
import { Server, Socket } from "socket.io";
import http from "http";

let io: Server;

const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("New socket connection", socket.id);

    socket.on("join_chat", (chatId: number) => {
      socket.join(chatId.toString());
      console.log(`User joined chat ${chatId}`);
    });

    socket.on("send_message", (message: string, chatId: number) => {
      io.to(chatId.toString()).emit("new_message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export { initSocket };
