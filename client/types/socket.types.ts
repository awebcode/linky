// socketTypes.ts

import type { TypingState } from "@/hooks/useTypingStore";
import type { MessageStatus, Status } from "@prisma/client";

export interface User {
  id: string;
  name: string;
  image: string;
  status: Status;
  lastActive: Date;
}

export interface Message {
  id: string;
  chatId: string;
  status: MessageStatus;
  content: string;
  sender: User;
  sentAt: Date;
  files?: { url: string }[];
}

export interface Chat {
  id: string;
  name: string;
  users: User[];
}

export interface SocketEventData {
  [SocketEvents.USER_ONLINE]: { user: User; chatIds: string[] };
  [SocketEvents.USER_OFFLINE]: { user: User; chatIds: string[] };
  [SocketEvents.MESSAGE_RECEIVED]: Message;
  [SocketEvents.USER_START_TYPING]: TypingState;
  [SocketEvents.USER_STOP_TYPING]: TypingState;
}

export enum SocketEvents {
  I_AM_ONLINE = "i-am-online",
  MESSAGE_SENT = "message-sent",
  MESSAGE_RECEIVED = "message-received",
  USER_ONLINE = "user-online",
  USER_OFFLINE = "user-offline",
  USER_START_TYPING = "user-typing",
  USER_STOP_TYPING = "user-stop-typing",
  HEART_BEAT = "heartbeat",
  MESSAGE_DELETED = "messageDeleted",
  MESSAGE_UPDATED = "messageUpdated",
  MESSAGE_SEEN = "messageSeen",
}
