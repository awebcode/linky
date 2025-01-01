import { create } from "zustand";
import { debounce } from "./use-debounce";
import type { ChatConversation } from "@/types/chat";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UnlistedUser } from "@/types/user";

// Define the debounce delay
const DEBOUNCE_DELAY = 500;

interface ChatStore {
  totalCount: number; // Total count of chats
  unlistedUsers: UnlistedUser[];
  chats: ChatConversation[]; // List of chat conversations
  selectedChat: ChatConversation | null; // Currently selected chat
  searchValue: string; // Search value for filtering chats

  // State setters
  setUnlistedUsers: (users: UnlistedUser[]) => void;
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
        unlistedUsers: [],
        chats: [],
        totalCount: 0,
        selectedChat: null,
        searchValue: "",

        // Setters
        setUnlistedUsers: (users: UnlistedUser[]) => set({ unlistedUsers: users }),
        setChats: (chats: ChatConversation[], totalCount: number) =>
          set({ chats, totalCount }),
        setSelectedChat: (chat: ChatConversation | null) => set({ selectedChat: chat }),
        setSearchValue: (value: string) => debouncedSetValue(value),

        // Clear localStorage
        clearStorage: () => {
          localStorage.removeItem("chat-storage");
          set({
            unlistedUsers: [],
            chats: [],
            totalCount: 0,
            selectedChat: null,
            searchValue: "",
          });
        },
      };
    },
    {
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        const { searchValue, unlistedUsers,chats, ...rest } = state;
        return rest;
      },
    }
  )
);
