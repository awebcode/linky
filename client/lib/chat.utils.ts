import type { TabId } from "@/hooks/useTabStore";
import type { ChatOnlineConversations } from "@/types/chat";
import { BlockAction, NotificationState } from "@prisma/client";
/**
 * Utility function to get the heading of the chat list
 * @param searchValue The value being searched
 * @param activeTab The current active tab: "all", "unread", "favorite", or "groups"
 * @param chats List of chats
 * @param unlistedUsers List of unlisted users
 * @returns The heading text based on the filters and active tab
 */
export const getChatsHeading = (
  searchValue: string,
  activeTab: TabId,
  chats: any[],
  unlistedUsers: any[]
) => {
  if (activeTab === "all") {
    if (searchValue && chats?.length > 0) {
      return `Search Results (${chats.length})`;
    } else if (chats?.length > 0) {
      return `Chats (${chats.length})`;
    } else if (searchValue && unlistedUsers?.length > 0) {
      return `Unlisted Users (${unlistedUsers.length})`;
    } else {
      return "No Chats";
    }
  }

  if (activeTab === "unread") {
    if (searchValue && chats?.length > 0) {
      return `Unread Chats (${chats.length})`;
    } else if (chats?.length > 0) {
      return `Unread Messages (${chats.length})`;
    } else if (searchValue && unlistedUsers?.length > 0) {
      return `Unlisted Users (${unlistedUsers.length})`;
    } else {
      return "No Unread Chats";
    }
  }

  if (activeTab === "favorite") {
    if (searchValue && chats?.length > 0) {
      return `Favorite Chats (${chats.length})`;
    } else if (chats?.length > 0) {
      return `Favorite Chats (${chats.length})`;
    } else if (searchValue && unlistedUsers?.length > 0) {
      return `Unlisted Users (${unlistedUsers.length})`;
    } else {
      return "No Favorite Chats";
    }
  }

  if (activeTab === "groups") {
    if (searchValue && chats?.length > 0) {
      return `Group Chats (${chats.length})`;
    } else if (chats?.length > 0) {
      return `Groups (${chats.length})`;
    } else if (searchValue && unlistedUsers?.length > 0) {
      return `Unlisted Users (${unlistedUsers.length})`;
    } else {
      return "No Groups";
    }
  }
  if (activeTab === "pinned") {
    if (searchValue && chats?.length > 0) {
      return `Pinned Chats (${chats.length})`;
    } else if (chats?.length > 0) {
      return `Pinned Chats (${chats.length})`;
    } else if (searchValue && unlistedUsers?.length > 0) {
      return `Unlisted Users (${unlistedUsers.length})`;
    } else {
      return "No Pinned Chats";
    }
  }

  if (activeTab === "archived") {
    if (searchValue && chats?.length > 0) {
      return `Archived Chats (${chats.length})`;
    } else if (chats?.length > 0) {
      return `Archived Chats (${chats.length})`;
    } else if (searchValue && unlistedUsers?.length > 0) {
      return `Unlisted Users (${unlistedUsers.length})`;
    } else {
      return "No Archived Chats";
    }
  }

  if (activeTab === "muted") {
    if (searchValue && chats?.length > 0) {
      return `Deleted Chats (${chats.length})`;
    } else if (chats?.length > 0) {
      return `Deleted Chats (${chats.length})`;
    } else if (searchValue && unlistedUsers?.length > 0) {
      return `Unlisted Users (${unlistedUsers.length})`;
    } else {
      return "No Deleted Chats";
    }
  }

  return "No Chats"; // Default case if none of the above
};

/**
 * Utility function to get the count of chats
 * @param searchValue
 * @param chats
 * @param unlistedUsers
 * @returns
 */

export const getChatsCount = (
  searchValue: string,
  chats: any[],
  unlistedUsers: any[]
) => {
  if (searchValue && chats?.length > 0) {
    return chats.length;
  } else if (chats?.length > 0) {
    return chats.length;
  } else if (searchValue && unlistedUsers?.length > 0) {
    return unlistedUsers.length;
  } else {
    return 0;
  }
};



export const getDefaultChatConversation = (): ChatOnlineConversations => ({
  id: "", // Default to an empty string, must be overridden
  chatId: "", // Default to an empty string, must be overridden
  isGroup: false,
  groupInfo: null, // Optional field, null by default
  lastMessage: null, // Default to no last message
  unreadCount: 0, // Default to zero unread messages
  pinnedAt: null, // Default to not pinned
  favoriteAt: null, // Default to not favorited
  unreadAt: null, // Default to no unread state
  notificationStatus: {
    status: NotificationState.UNMUTED,
    mutedUntil: null,
  }, // Default notification status
  blockedStatus: {
    status: BlockAction.UNBLOCKED,
    blockedUntil: null,
    blockedBy: null,
  }, // Default block status
});
