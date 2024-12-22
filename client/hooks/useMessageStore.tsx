// src/store/useMessageStore.ts
import { create } from "zustand";
import { Message, Reaction, MessageSeen } from "@prisma/client"; // Prisma client models

interface MessageWithRelations extends Message {
  reactions: Reaction[]; // Add reactions as an array
  MessageSeen: MessageSeen[]; // Add MessageSeen as an array
}

interface MessageStore {
  messages: MessageWithRelations[]; // Store messages with reactions and MessageSeen
  setMessages: (messages: MessageWithRelations[]) => void; // Set messages with reactions and MessageSeen
  addMessage: (message: MessageWithRelations) => void;
  addReaction: (messageId: string, reaction: Reaction) => void;
  addMessageSeen: (messageId: string, userId: string) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [], // Initial empty messages array
  setMessages: (messages) => set({ messages }), // Function to set the list of messages
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })), // Function to add a new message
  addReaction: (messageId, reaction) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId
          ? { ...message, reactions: [...message.reactions, reaction] }
          : message
      ),
    })),
  addMessageSeen: (messageId, userId) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              MessageSeen: [
                ...message.MessageSeen,
                {
                  id: String(Date.now()), // Generate a unique id (e.g., based on the current timestamp)
                  messageId: message.id, // Ensure the messageId is set properly
                  userId: userId, // Use the provided userId
                  seenAt: new Date(), // Set the current timestamp as seenAt
                },
              ],
            }
          : message
      ),
    })),
}));
