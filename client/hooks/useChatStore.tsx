import { create } from "zustand";
import { debounce } from "./use-debounce";
import type { ChatConversation } from "@/types/chat";
import { createJSONStorage, persist } from "zustand/middleware";

// Define the debounce delay
const DEBOUNCE_DELAY = 700;

interface ChatStore {
  totalCount: number; // Total count of chats
  chats: ChatConversation[]; // List of chat conversations
  selectedChat: ChatConversation | null; // Currently selected chat
  searchValue: string; // Search value for filtering chats

  // State setters
  setChats: (chats: ChatConversation[], totalCount: number) => void;
  setSelectedChat: (chat: ChatConversation | null) => void;
  setSearchValue: (value: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => {
      // Debounced setter for searchValue
      const debouncedSetValue = debounce((value: string) => {
        set({ searchValue: value });
      }, DEBOUNCE_DELAY);

      return {
        // Initial states
        chats: [],
        totalCount: 0,
        selectedChat: null,
        searchValue: "",

        // Setters
        setChats: (chats: ChatConversation[], totalCount: number) =>
          set({ chats, totalCount }),

        setSelectedChat: (chat: ChatConversation | null) => set({ selectedChat: chat }),

        setSearchValue: (value: string) => debouncedSetValue(value),
      };
    },
    {
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        const { searchValue, ...rest } = state;
        return rest;
      },
    }
  )

  // Key for localStorage persistence
);
