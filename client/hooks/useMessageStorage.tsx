import type { MessageResponse } from "@/types/message"; // Assuming MessageResponse is the type for individual messages
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandIndexedDBStorage } from "./cache/usePersist";
import type { MessageStatus } from "@prisma/client";

interface MessageStore {
  message: Record<string, string>; // Draft message for each chat ID
  messages: Record<string, MessageResponse[]>; // Messages grouped by chat ID (using MessageResponse)
  files: Record<string, File[]>; // Files grouped by chat ID
  totalMessagesCount: Record<string, number>; // Total messages count per chat ID
  setMessages: (
    chatId: string,
    messages: MessageResponse[],
    totalMessagesCount: number
  ) => void; // Set messages for a specific chat
  addMessages: (
    chatId: string,
    newMessages: MessageResponse[],
    totalMessagesCount: number
  ) => void; // Append new messages to existing ones
  setMessage: (chatId: string, message: string) => void; // Draft message per chat
  setFiles: (chatId: string, files: File[]) => void; // Set files for a specific chat
  updateMessageStatus: (chatId: string, messageId: string, status: MessageStatus) => void; // Update message status
  clearMessages: (chatId: string) => void; // Clear messages for a specific chat
  clearDraft: (chatId: string) => void; // Clear draft message for a specific chat
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      // Initial state
      message: {}, // Store draft messages per chat ID
      messages: {}, // Store messages per chat ID (using MessageResponse)
      files: {}, // Store files per chat ID
      totalMessagesCount: {}, // Store total message counts per chat ID
      // Set or update messages for a specific chat (merges with existing messages and ensures uniqueness)
      setMessages: (
        chatId,
        newMessages,
        totalMessagesCount=0
      ) =>
        set((state) => {
          // Get the existing messages for the chat
          const existingMessages = state.messages[chatId] || [];

          // Remove messages with the same ID from the existing messages
          const filteredExistingMessages = existingMessages.filter(
            (existingMsg) => !newMessages.some((newMsg) => newMsg.id === existingMsg.id)
          );

          // Combine the new messages with the filtered existing messages
          const allMessages = [...newMessages,...filteredExistingMessages];

          // Ensure uniqueness of messages based on ID (if there are any duplicates)
          const uniqueMessages = allMessages.filter(
            (msg, index, self) => index === self.findIndex((m) => m.id === msg.id)
          );

          const newCount =
            totalMessagesCount !== undefined
              ? totalMessagesCount
              : (state.totalMessagesCount[chatId] || 0) + newMessages.length;

          return {
            messages: { ...state.messages, [chatId]: uniqueMessages },
            totalMessagesCount: {
              ...state.totalMessagesCount,
              [chatId]: newCount,
            },
          };
        }),

      // Add more messages to an existing chat (for pagination or new messages)
      addMessages: (
        chatId,
        newMessages,
        totalMessagesCount
      ) =>
        set((state) => {
          const existingMessages = state.messages[chatId] || [];
          const allMessages = [...existingMessages, ...newMessages];
          const uniqueMessages = allMessages.filter(
            (msg, index, self) => index === self.findIndex((m) => m.id === msg.id)
          );

          return {
            messages: { ...state.messages, [chatId]: uniqueMessages },
            totalMessagesCount: {
              ...state.totalMessagesCount,
              [chatId]:
                totalMessagesCount !== 0
                  ? totalMessagesCount
                  : state.totalMessagesCount[chatId],
            },
          };
        }),

      // Set draft message for a specific chat
      setMessage: (chatId, message) =>
        set((state) => ({
          message: { ...state.message, [chatId]: message },
        })),

      // Set files for a specific chat
      setFiles: (chatId, files) =>
        set((state) => ({
          files: { ...state.files, [chatId]: files },
        })),

      // Update the status of a specific message
      updateMessageStatus: (chatId, messageId, status) =>
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
          const { [chatId]: count, ...countRest } = state.totalMessagesCount;
          return {
            messages: rest,
            totalMessagesCount: countRest,
          };
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
      storage: createJSONStorage(() => zustandIndexedDBStorage),
      partialize(state) {
        const { ...rest } = state; //messages
        return rest;
      },
    }
  )
);
