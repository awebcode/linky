import type { LucideIcon } from "lucide-react";
import { Status, type Message, type NotificationState } from "@prisma/client";
export interface User {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface MessageWithUser {
  id: number;
  content: string;
  timestamp: Date;
  user: User;
}

export interface ChatGroup {
  id: number;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

export interface UserActionDropdownItem {
  icon?: LucideIcon; // Icon component
  text: string; // Button text
  action: () => void; // Function to handle button click
}

export interface ChatConversationUser {
  id: string;
  name: string;
  image: string;
  status: Status;
}
export type NotificationStatus = {
  status: NotificationState;
  mutedUntil: Date | null;
};

export interface ChatConversation {
  id: string;
  nextCursor: string;
  totalCount: number;
  isGroup: boolean;
  groupInfo: {
    groupId: string;
    groupName: string;
    groupImage: string;
    timestamp: string | null;
    createdAt: string;
  };
  user: ChatConversationUser;
  lastMessage: Message | null;
  messages:Message[];
  timestamp: string | null;
  createdAt: string; // ISO string format for date
  unreadCount: number;
  membersCount: number;
  adminsCount: number;
  admins: ChatConversationUser[];

  notificationStatus: NotificationStatus;
  blockedStatus: {
    status: "BLOCKED" | "NOT_BLOCKED";
    blockedUntil: Date | null;
    blockedBy: ChatConversationUser | null;
  };
  archivedAt: Date | null;
  pinnedAt: Date | null;
}
