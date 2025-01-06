import type { LucideIcon } from "lucide-react";
import { Status, type NotificationState, type BlockAction } from "@prisma/client";
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

export interface ChatConversationUser {
  id: string;
  name: string;
  image: string;
  status: Status;
}

export interface Message {
  id: string;
  content: string;
  sentAt: Date;
  senderId: string;
}

export interface BlockedStatus {
  status: BlockAction; // Indicates if the current user is blocked
  blockedUntil: Date | null; // Date until the user is blocked
  blockedBy: ChatConversationUser | null; // User who blocked the current user
}
/**
 * Interface for the count of total chats, unread chats, favorite chats, and group chats
 */
export type ChatsCount = {
  totalChatsCount: number;
  unreadChatsCount: number;
  favoriteChatsCount: number;
  groupChatsCount: number;
  pinnedChatsCount: number;
  blockedChatsCount: number;
  mutedChatsCount: number;
  archivedChatsCount: number;
};

export interface ChatConversation {
  id: string;
  chatId: string;
  nextCursor: string;
  // totalChatMembersCount: number;
  unlistedUsers: ChatConversationUser[]; // Users not yet added to the chat (for search purposes)
  nextUnlistedCursor: string | null; // Cursor for pagination in unlisted users

  isGroup: boolean;

  // Group information (for group chats only)
  groupInfo: {
    groupId: string;
    groupName: string;
    groupImage: string;
    createdAt: string; // ISO date string for when the group was created
  } | null;

  // The other user in the chat for 1:1 chats, or null for group chats
  user: ChatConversationUser;

  // The last message in the chat, or null if there are no messages
  lastMessage: Message | null;

  // Array of messages in the chat (the latest messages are included)
  messages: Message[];

  // Timestamp of the last message sent in the chat
  timestamp: string | null;

  // Creation date of the chat (ISO string format)
  createdAt: string;

  // Number of unread messages in the chat for the current user
  unreadCount: number;

  // Number of members in the chat
  membersCount: number;

  // Number of admins in the group chat
  adminsCount: number;

  // List of admins in the chat (only for group chats)
  admins: ChatConversationUser[];

  // Notification status for the current user (e.g., muted)
  notificationStatus: NotificationStatus;

  // Block status of the current user (for blocked users)
  blockedStatus: BlockedStatus;

  // The date when the chat was archived (null if not archived)
  archivedAt: Date | null;

  // The date when the chat was pinned (null if not pinned)
  pinnedAt: Date | null;
  favoriteAt: Date | null;
  unreadAt: Date | null;
  

}

//online conversations
export interface OnlineUser {
  id: string;
  name: string;
  image: string;
  status: string;
  lastActive: Date;
}

interface OnlineChatMember {
  chatId: string;
  id: string;
  onlineUser: OnlineUser;
}

export interface GetOnlineConversationsResponse {
  onlineChatMembers: OnlineChatMember[];
  totalOnlineChatMembersCount: number;
  nextChatCursor: string | null;
  nextUserCursor: string | null;
}

// Inputs

export interface CreateChatInput {
  members: string[];
  isGroupChat: boolean;
  name?: string;
}
