// src/store/useChatStore.ts
import { create } from "zustand";
import { Chat } from "@prisma/client"; // Assuming you have a `Chat` type from your Prisma models

interface ChatStore {
  selectedChat: Chat | null; // Store the selected chat
  setSelectedChat: (chat: Chat | null) => void; // Function to update the selected chat
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedChat: null, // Initially, no chat is selected
  setSelectedChat: (chat) => set({ selectedChat: chat }), // Function to set the selected chat
}));
