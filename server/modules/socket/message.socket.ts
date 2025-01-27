import type { z } from "zod";
import type { CreateSocketMessageSchema } from "./dtos.socket";
import type { Server, Socket } from "socket.io";
import { createMessageForSocket } from "./db.socket";
import { SocketEvents, type SocketEventData } from "../../types/socket.types";

/**
 * Handle a new message being sent.
 */
export const handleMessage = async (
  data: z.infer<typeof CreateSocketMessageSchema>,
  io: Server
) => {
  // console.log("Message received:", data);

  await createMessageForSocket(data);
  //send to socket after saved to database
  io.in(data.chatId).emit(SocketEvents.MESSAGE_RECEIVED,data);

  //sent to database
};

/**
 * Handle a user starting to type.
 * @param data
 * @param io: Server
 */
export const handleStartTyping = async (
  data: {
    chatId: string;
    userInfo: object;
  },
  socket: Socket
) => {
  //sending all the users in the room except the sender

  socket.to(data.chatId).emit(SocketEvents.USER_START_TYPING, data);
};

/**
 * Handle a user stopping typing.
 * @param data
 * @param socket: Socket
 */
export const handleStopTyping = async (
  data: {
    chatId: string;
    userInfo: object;
  },
  socket: Socket
) => {
  //sending all the users in the room except the sender

  socket.to(data.chatId).emit(SocketEvents.USER_STOP_TYPING, data);
};
