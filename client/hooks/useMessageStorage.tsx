import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Message } from "@/types/message";

interface MessageStore {
  message: Record<string, string>; // Draft message for each chat ID
  messages: Record<string, Message[]>; // Messages grouped by chat ID
  files: Record<string, File[]>;
  setMessages: (chatId: string, messages: Message[]) => void;
  setMessage: (chatId: string, message: string) => void; // Draft message per chat
  setFiles: (chatId: string, files: File[]) => void;
  updateMessageStatus: (chatId: string, messageId: string, status: string) => void;
  clearMessages: (chatId: string) => void;
  clearDraft: (chatId: string) => void; // Clear draft message for a chat
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      // Initial state
      message: {}, // Store draft per chat ID
      messages: {},
      files: {},

      // Set draft message for a specific chat
      setMessage: (chatId: string, message: string) =>
        set((state) => ({
          message: { ...state.message, [chatId]: message },
        })),

      // Set messages for a specific chat
      setMessages: (chatId: string, messages: Message[]) =>
        set((state) => ({
          messages: { ...state.messages, [chatId]: messages },
        })),

      // Set files for a specific chat
      setFiles: (chatId: string, files: File[]) =>
        set((state) => ({
          files: { ...state.files, [chatId]: files },
        })),

      // Update the status of a specific message
      updateMessageStatus: (chatId: string, messageId: string, status: string) =>
        set((state) => {
          const chatMessages = state.messages[chatId] || [];
          const updatedMessages = chatMessages.map((msg) =>
            msg.id === messageId ? { ...msg, status } : msg
          );
          return { messages: { ...state.messages, [chatId]: updatedMessages } };
        }),

      // Clear all messages for a specific chat
      clearMessages: (chatId: string) =>
        set((state) => {
          const { [chatId]: _, ...rest } = state.messages;
          return { messages: rest };
        }),

      // Clear draft for a specific chat
      clearDraft: (chatId: string) =>
        set((state) => {
          const { [chatId]: _, ...rest } = state.message;
          return { message: rest };
        }),
    }),
    {
      name: "message-storage",
      storage: createJSONStorage(() => localStorage),
      // partialize: (state) => {
      //   const { message, ...rest } = state;
      //   return rest;
      // },
    }
  )
);
