import type { TypingUser } from "@/types/user";
import { create } from "zustand";

interface TypingState {
  chatId: string;
  userInfo: TypingUser;
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
      // Check if the user is already typing in the same chat
      const isAlreadyTyping = state.typingUsers.some(
        (user) =>
          user.userInfo.id === typingState.userInfo.id &&
          user.chatId === typingState.chatId
      );

      if (isAlreadyTyping) return state;

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
