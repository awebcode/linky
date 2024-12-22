import type { LucideIcon } from "lucide-react";

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
