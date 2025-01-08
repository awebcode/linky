import type { TypingUser } from "@/types/user";
import { create } from "zustand";

export interface TypingState {
  chatId: string;
  userInfo: TypingUser & { content?: string };
}

interface TypingStore {
  typingUsers: TypingState[];
  startTyping: (typingState: TypingState) => void;
  stopTyping: (userId: string, chatId: string) => void;
}

export const useTypingStore = create<TypingStore>((set) => ({
  typingUsers: [],

  startTyping: (typingState) =>
    set((state) => {
      const updatedTypingUsers = state.typingUsers.map((user) => {
        if (
          user.userInfo.id === typingState.userInfo.id &&
          user.chatId === typingState.chatId
        ) {
          // Update content if the user is already typing
          return {
            ...user,
            userInfo: {
              ...user.userInfo,
              content: typingState.userInfo.content,
            },
          };
        }
        return user;
      });

      const isAlreadyTyping = state.typingUsers.some(
        (user) =>
          user.userInfo.id === typingState.userInfo.id &&
          user.chatId === typingState.chatId
      );

      if (isAlreadyTyping) return { typingUsers: updatedTypingUsers };

      // Add the new typing state
      return {
        typingUsers: [...state.typingUsers, typingState],
      };
    }),

  stopTyping: (userId, chatId) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter(
        (typingUser) => typingUser.userInfo.id !== userId || typingUser.chatId !== chatId
      ),
    })),
}));
