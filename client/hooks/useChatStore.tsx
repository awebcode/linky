import { create } from "zustand";
import { debounce } from "./use-debounce";
import type { ChatConversation, ChatConversationUser, Message, OnlineUser } from "@/types/chat";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandIndexedDBStorage } from "./cache/usePersist";
import type { UnlistedUser } from "@/types/user";
import type { TabId } from "./useTabStore";

// Define the debounce delay
const DEBOUNCE_DELAY = 500;

interface ChatStore {
  totalChatMembersCount: Record<string, number>; // Using a Record to store counts based on tab ID
  unlistedUsers: UnlistedUser[];
  chats: Record<TabId, ChatConversation[]>; // Store chats by activeTab (TabId)
  filteredChats: {
    chats: ChatConversation[];
    unlistedChats: UnlistedUser[];
  };
  selectedChat: ChatConversation | null;
  searchValue: string;

  // New blocks to manage mute, archive, block, and mute durations
  mutedChats: Set<string>; // Set to store muted chat IDs
  archivedChats: Set<string>; // Set to store archived chat IDs
  blockedChats: Set<string>; // Set to store blocked chat IDs
  mutedUntil: Record<string, number>; // Mapping of chat IDs to mute expiration times

  bulkUpdateConversationsForOnlineOffline: (
    chatIds: string[],
    userInfo: ChatConversationUser //OnlineUser|
  ) => void;
  setChats: (
    activeTab: TabId,
    chats: ChatConversation[],
    totalChatMembersCount: number
  ) => void;
  setUnlistedUsers: (users: UnlistedUser[]) => void;
  setFilteredChats: (
    filteredChats: {
      chats: ChatConversation[];
      unlistedChats: UnlistedUser[];
    },
    activeTab: TabId
  ) => void;
  setSelectedChat: (chat: ChatConversation | null) => void;
  setSearchValue: (value: string) => void;
  updateLastMessage: (chatId: string, lastMessage: Message, activeTab: TabId) => void;

  // New functions
  deleteChat: (chatId: string, activeTab: TabId) => void;
  pinChat: (chatId: string, activeTab: TabId) => void;
  markAsUnread: (chatId: string, activeTab: TabId) => void;
  favoriteChat: (chatId: string, activeTab: TabId) => void;

  // Mute, archive, and block management functions
  muteChat: (chatId: string, muteUntil: number) => void;
  unmuteChat: (chatId: string) => void;
  archiveChat: (chatId: string) => void;
  unarchiveChat: (chatId: string) => void;
  blockChat: (chatId: string) => void;
  unblockChat: (chatId: string) => void;

  getDisplayedChats: (activeTab: TabId) => ChatConversation[];
  getDisplayedUnlistedUsers: () => UnlistedUser[];

  clearStorage: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => {
      const debouncedSetValue = debounce((value: string) => {
        set({ searchValue: value });
      }, DEBOUNCE_DELAY);

      return {
        totalChatMembersCount: {},
        unlistedUsers: [],
        chats: {} as Record<TabId, ChatConversation[]>,
        filteredChats: { chats: [], unlistedChats: [] },
        selectedChat: null,
        searchValue: "",

        // New state blocks
        mutedChats: new Set(),
        archivedChats: new Set(),
        blockedChats: new Set(), // Add blocked chats block
        mutedUntil: {},

        setChats: (
          activeTab: TabId,
          chats: ChatConversation[],
          totalChatMembersCount: number
        ) => {
          set((state) => {
            const existingChats = state.chats[activeTab] || [];

            // Create a Map to ensure uniqueness by chatId
            const chatMap = new Map<string, ChatConversation>();

            // Add existing chats to the map
            existingChats.forEach((chat) => chatMap.set(chat.chatId, chat));

            // Add new chats to the map (overwriting duplicates based on chatId)
            chats.forEach((chat) => chatMap.set(chat.chatId, chat));

            // Convert the map values back to an array
            const combinedChats = Array.from(chatMap.values());

            return {
              chats: {
                ...state.chats,
                [activeTab]: combinedChats,
              },
              totalChatMembersCount: {
                ...state.totalChatMembersCount,
                [activeTab]: totalChatMembersCount,
              },
            };
          });
        },

        setUnlistedUsers: (users) => set({ unlistedUsers: users }),
        setFilteredChats: (filteredChats, activeTab) => {
          const { chats, unlistedUsers } = get();
          const filteredChatsList = filteredChats.chats.filter((chat) =>
            chats[activeTab]?.filter((c) => c.chatId !== chat.id)
          );
          const filteredUnlistedUsers = filteredChats.unlistedChats.filter((user) =>
            unlistedUsers.filter((u) => u.id !== user.id)
          );

          set({
            filteredChats: {
              chats: filteredChatsList,
              unlistedChats: filteredUnlistedUsers,
            },
          });
        },

        setSelectedChat: (chat) => set({ selectedChat: chat }),
        setSearchValue: debouncedSetValue,

        updateLastMessage: (chatId, lastMessage, activeTab) => {
          set((state) => {
            const updatedChats = state.chats[activeTab]?.map((chat) =>
              chat.chatId === chatId ? { ...chat, lastMessage } : chat
            );

            const chatToMove = updatedChats?.find((chat) => chat?.chatId === chatId);
            const remainingChats = updatedChats?.filter(
              (chat) => chat?.chatId !== chatId
            );

            return {
              chats: {
                ...state.chats,
                [activeTab]: chatToMove
                  ? [chatToMove, ...remainingChats]
                  : remainingChats,
              },
            };
          });
        },
        bulkUpdateConversationsForOnlineOffline: (chatIds, userInfo) => {
          set((state) => {
            const updatedChats = { ...state.chats }; // Clone chats
            const chatConversations = updatedChats["all"] || []; // Get all chats under "all" tab

            // Iterate over chat conversations to update online status
            const updatedConversations = chatConversations.map((conversation) => {
              if (!chatIds.includes(conversation.chatId)) {
                return conversation; // Skip chats not included in the provided IDs
              }

              const { onlineUsers = [], totalOnlineUsers = 0 } = conversation; // Ensure defaults
              const isUserAlreadyOnline = onlineUsers.some(
                (user) => user.id === userInfo.id
              );

              if (userInfo.status === "ONLINE" && !isUserAlreadyOnline) {
                return {
                  ...conversation,
                  onlineUsers: [...onlineUsers, userInfo],
                  totalOnlineUsers: totalOnlineUsers + 1,
                };
              } else if (userInfo.status === "OFFLINE" && isUserAlreadyOnline) {
                return {
                  ...conversation,
                  onlineUsers: onlineUsers.filter((user) => user.id !== userInfo.id),
                  totalOnlineUsers: Math.max(0, totalOnlineUsers - 1), // Ensure no negative values
                };
              }

              return conversation; // Return unchanged if no update needed
            });
              // console.log({ updatedConversations });


            // Update the "all" tab with the modified conversations
            updatedChats["all"] = updatedConversations;

            return {
              chats: updatedChats,
            };
          });
        },

        deleteChat: (chatId: string, activeTab: TabId) => {
          set((state) => {
            const updatedChats = state.chats[activeTab]?.filter(
              (chat) => chat.chatId !== chatId
            );
            return {
              chats: { ...state.chats, [activeTab]: updatedChats },
            };
          });
        },

        pinChat: (chatId: string, activeTab: TabId) => {
          set((state) => {
            const chatToMove = state.chats[activeTab]?.find(
              (chat) => chat.chatId === chatId
            );
            if (!chatToMove) return { chats: state.chats };

            const updatedChats = state.chats[activeTab]?.filter(
              (chat) => chat.chatId !== chatId
            );

            const pinnedTab = "pinned";
            const updatedPinnedChats = [
              ...(state.chats[pinnedTab] || []),
              { ...chatToMove, pinnedAt: new Date() },
            ];

            return {
              chats: {
                ...state.chats,
                [activeTab]: updatedChats,
                [pinnedTab]: updatedPinnedChats,
              },
            };
          });
        },

        markAsUnread: (chatId: string, activeTab: TabId) => {
          set((state) => {
            const chatToMove = state.chats[activeTab]?.find(
              (chat) => chat.chatId === chatId
            );
            if (!chatToMove) return { chats: state.chats };

            const updatedChats = state.chats[activeTab]?.filter(
              (chat) => chat.chatId !== chatId
            );

            const unreadTab = "unread";
            const updatedUnreadChats = [
              ...(state.chats[unreadTab] || []),
              { ...chatToMove, unreadAt: new Date() },
            ];

            return {
              chats: {
                ...state.chats,
                [activeTab]: updatedChats,
                [unreadTab]: updatedUnreadChats,
              },
            };
          });
        },

        favoriteChat: (chatId: string, activeTab: TabId) => {
          set((state) => {
            const chatToMove = state.chats[activeTab]?.find(
              (chat) => chat.chatId === chatId
            );
            if (!chatToMove) return { chats: state.chats };

            const updatedChats = state.chats[activeTab]?.filter(
              (chat) => chat.chatId !== chatId
            );

            const favoriteTab = "favorite";
            const updatedFavoriteChats = [
              ...(state.chats[favoriteTab] || []),
              { ...chatToMove, favoriteAt: new Date() },
            ];

            return {
              chats: {
                ...state.chats,
                [activeTab]: updatedChats,
                [favoriteTab]: updatedFavoriteChats,
              },
            };
          });
        },

        muteChat: (chatId: string, muteUntil: number) => {
          set((state) => {
            const updatedMutedChats = new Set(state.mutedChats);
            updatedMutedChats.add(chatId);

            const updatedMutedUntil = { ...state.mutedUntil, [chatId]: muteUntil };
            return {
              mutedChats: updatedMutedChats,
              mutedUntil: updatedMutedUntil,
            };
          });
        },

        unmuteChat: (chatId: string) => {
          set((state) => {
            const updatedMutedChats = new Set(state.mutedChats);
            updatedMutedChats.delete(chatId);

            const updatedMutedUntil = { ...state.mutedUntil };
            delete updatedMutedUntil[chatId];
            return {
              mutedChats: updatedMutedChats,
              mutedUntil: updatedMutedUntil,
            };
          });
        },

        archiveChat: (chatId: string) => {
          set((state) => {
            const updatedArchivedChats = new Set(state.archivedChats);
            updatedArchivedChats.add(chatId);
            return { archivedChats: updatedArchivedChats };
          });
        },

        unarchiveChat: (chatId: string) => {
          set((state) => {
            const updatedArchivedChats = new Set(state.archivedChats);
            updatedArchivedChats.delete(chatId);
            return { archivedChats: updatedArchivedChats };
          });
        },

        blockChat: (chatId: string) => {
          set((state) => {
            const updatedBlockedChats = new Set(state.blockedChats);
            updatedBlockedChats.add(chatId);
            return { blockedChats: updatedBlockedChats };
          });
        },

        unblockChat: (chatId: string) => {
          set((state) => {
            const updatedBlockedChats = new Set(state.blockedChats);
            updatedBlockedChats.delete(chatId);
            return { blockedChats: updatedBlockedChats };
          });
        },

        getDisplayedChats: (activeTab: TabId) => {
          return get().chats[activeTab] || [];
        },

        getDisplayedUnlistedUsers: () => get().unlistedUsers,

        clearStorage: () => set(() => ({ chats: {} as any, totalChatMembersCount: {} })),
      };
    },

    {
      name: "chat-storage",
      storage: createJSONStorage(() => zustandIndexedDBStorage),
      partialize(state) {
        const { searchValue, filteredChats, ...rest } = state;
        return rest;
      },
    }
  )
);
