import { create } from "zustand";
import type { GetOnlineConversationsResponse, OnlineUser } from "@/types/chat";

interface OnlineConversationsStore {
  onlineConversations: GetOnlineConversationsResponse["onlineChatMembers"];
  totalOnlineChatMembersCount: number;
  addInitialOnlineConversations: (
    conversations: GetOnlineConversationsResponse["onlineChatMembers"],
    totalCount: number
  ) => void;

  addBulkOnlineUsers: (chatIds: string[], userInfo: OnlineUser[]) => void;



}

export const useOnlineConversationsStore = create<OnlineConversationsStore>((set) => ({
  onlineConversations: [],
  totalOnlineChatMembersCount: 0,

  // Add initial conversations with pagination support
  addInitialOnlineConversations: (conversations, totalCount) => {
    set({
      onlineConversations: conversations,
      totalOnlineChatMembersCount: totalCount,
    });
  },

  // Add or update users for a set of chatIds
  addBulkOnlineUsers: (chatIds, userInfo) =>
    set((state) => {
      // Create a map to track if a user has already been added to a chat
      const userMap = new Map<string, string>(); // userId -> chatId

      const updatedMembers = chatIds
        .map((chatId, index) => {
          const { id: userId, status } = userInfo[index] || {}; // Fallback to avoid undefined error

          // Skip invalid or missing user info
          if (!userId || (status !== "ONLINE" && status !== "OFFLINE")) {
            return null;
          }

          // Ensure that the user is not already added to another chat
          if (userMap.has(userId)) {
            return null; // This user is already in another chat
          }

          // Check if the user is already in this chat
          const existingMember = state.onlineConversations.find(
            (conv) => conv.chatId === chatId && conv.onlineUser.id === userId
          );

          if (existingMember) {
            return null; // User already in the chat, skip
          }

          // Add this user to the user map (chat-specific)
          userMap.set(userId, chatId);

          // Add the new member if no duplicates
          return {
            chatId,
            id: userId,
            onlineUser: userInfo[index],
          };
        })
        .filter(Boolean); // Remove any null entries

      return {
        onlineConversations: [...state.onlineConversations, ...updatedMembers] as any,
      };
    }),

 


}));
