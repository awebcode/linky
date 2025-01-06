import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ChatsCount } from "@/types/chat";
import { zustandIndexedDBStorage } from "./cache/usePersist";

interface CountStore {
  chatsCount: ChatsCount;
  setChatsCount: (chatsCount: ChatsCount) => void;
}

export const useCountStore = create<CountStore>()(
  persist(
    (set) => {
      return {
        chatsCount: {
          totalChatsCount: 0,
          unreadChatsCount: 0,
          favoriteChatsCount: 0,
          groupChatsCount: 0,
          pinnedChatsCount: 0,
          blockedChatsCount: 0,
          mutedChatsCount: 0,
          archivedChatsCount: 0,
        },

        setChatsCount: (chatsCount: ChatsCount) => {
          set((state) => ({ chatsCount: { ...state.chatsCount, ...chatsCount } }));
        },
      };
    },
    {
      name: "count-storage",
      storage: createJSONStorage(() => zustandIndexedDBStorage),
    }
  )
);
