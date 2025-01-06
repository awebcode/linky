import type { GetOnlineConversationsResponse } from "@/types/chat";
import { create } from "zustand";

// Define the correct types based on the response structure
interface OnlineConversationsStore {
  onlineConversations: GetOnlineConversationsResponse["onlineChatMembers"];
  totalOnlineChatMembersCount: number;
  addInitialOnlineConversations: (
    conversations: GetOnlineConversationsResponse["onlineChatMembers"],
    totalOnlineChatMembersCount: number
  ) => void;
  addOnlineConversation: (
    conversation: GetOnlineConversationsResponse["onlineChatMembers"][0]
  ) => void;
  updateOnlineConversation: (
    chatId: string,
    updatedFields: Partial<GetOnlineConversationsResponse["onlineChatMembers"][0]>
  ) => void;
  removeOnlineConversation: (chatId: string) => void;
  getOnlineConversations: (
    chatId: string
  ) => GetOnlineConversationsResponse["onlineChatMembers"][0] | undefined;
  setTotalOnlineChatMembersCount: (count: number) => void;
}

export const useOnlineConversationsStore = create<OnlineConversationsStore>(
  (set, get) => ({
    onlineConversations: [],
    totalOnlineChatMembersCount: 0, // Initialize the count to 0

    // Add initial online conversations and set the total count
    addInitialOnlineConversations: (conversations, count) => {
      set({
        onlineConversations: conversations,
        totalOnlineChatMembersCount: count, // Set the total count to the length of the initial list
      });
    },

    // Add a new online conversation and update the count
    addOnlineConversation: (conversation) => {
      set((state) => ({
        onlineConversations: [...state.onlineConversations, conversation],
        totalOnlineChatMembersCount: state.totalOnlineChatMembersCount + 1, // Increment the count
      }));
    },

    // Update an existing online conversation (no change to total count)
    updateOnlineConversation: (chatId, updatedFields) =>
      set((state) => ({
        onlineConversations: state.onlineConversations.map((conv) =>
          conv.chatId === chatId ? { ...conv, ...updatedFields } : conv
        ),
      })),

    // Remove an online conversation and update the count
    removeOnlineConversation: (chatId) =>
      set((state) => ({
        onlineConversations: state.onlineConversations.filter(
          (conv) => conv.chatId !== chatId
        ),
        totalOnlineChatMembersCount: state.totalOnlineChatMembersCount - 1, // Decrement the count
      })),

    // Retrieve a specific online conversation by chatId
    getOnlineConversations: (chatId) =>
      get().onlineConversations.find((conv) => conv.chatId === chatId),

    // Manually set the total count (useful if total is fetched independently)
    setTotalOnlineChatMembersCount: (count) =>
      set({ totalOnlineChatMembersCount: count }),
  })
);
