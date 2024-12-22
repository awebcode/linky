import { handleLogout } from "@/hooks/use-user";
import type { UserActionDropdownItem } from "@/types/chat";
import { User, Settings, LogOut, MessageSquareWarning, Blocks, Ban, VolumeOff, Info, X, UserRoundMinus } from "lucide-react";
export const userMenuItems: UserActionDropdownItem[] = [
  {
    icon: User,
    text: "Profile",
    action: () => {
      // Handle profile click
      console.log("Profile clicked");
    },
  },
  {
    icon: Settings,
    text: "Settings",
    action: () => {
      // Handle settings click
      console.log("Settings clicked");
    },
  },
  {
    icon: LogOut,
    text: "Logout",
    action: handleLogout,
  },
];
// chat right side menu
import { MessageCircle, Share, Star, Trash } from "lucide-react"; // Import relevant icons from lucide-react

export const messageRightSideMenuItems: UserActionDropdownItem[] = [
  {
    icon: MessageCircle, // Icon for Reply
    text: "Reply",
    action: () => {
      // Handle reply action
      console.log("Reply clicked");
    },
  },
  {
    icon: Share, // Icon for Forward
    text: "Forward",
    action: () => {
      // Handle forward action
      console.log("Forward clicked");
    },
  },
  {
    icon: Star, // Icon for Star Message
    text: "Star Message",
    action: () => {
      // Handle star message action
      console.log("Star Message clicked");
    },
  },
  {
    icon: UserRoundMinus, // Icon for Star Message
    text: "Unsent",
    action: () => {
      // Handle star message action
      console.log("Star Message clicked");
    },
  },
  {
    icon: Trash, // Icon for Delete
    text: "Delete",
    action: () => {
      // Handle delete action
      console.log("Delete clicked");
    },
  },
];

export const chatRightSideMenuItems: UserActionDropdownItem[] = [
  {
    icon: Info, // Icon for Delete
    text: "Contact Info",
    action: () => {
      // Handle delete action
      console.log("Delete clicked");
    },
  },
  {
    icon: X, // Icon for Delete
    text: "Close Chat",
    action: () => {
      // Handle delete action
      console.log("Delete clicked");
    },
  },
  {
    icon: VolumeOff, // Icon for Delete
    text: "Mute Notifications",
    action: () => {
      // Handle delete action
      console.log("Delete clicked");
    },
  },
  {
    icon: Star, // Icon for Delete
    text: "Add To Favorites",
    action: () => {
      // Handle delete action
      console.log("Delete clicked");
    },
  },
  {
    icon: Ban, // Icon for Delete
    text: "Block",
    action: () => {
      // Handle delete action
      console.log("Delete clicked");
    },
  },

  {
    icon: MessageSquareWarning, // Icon for Delete
    text: "Report",
    action: () => {
      // Handle delete action
      console.log("Delete clicked");
    },
  },
  {
    icon: Trash, // Icon for Delete
    text: "Delete",
    action: () => {
      // Handle delete action
      console.log("Delete clicked");
    },
  },
];