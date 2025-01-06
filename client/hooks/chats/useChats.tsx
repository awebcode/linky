import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";
import type { ChatConversation } from "@/types/chat";
import { useChatStore } from "../useChatStore";
import { useShallow } from "zustand/react/shallow";
import type { UnlistedUser } from "@/types/user";
import { useTabStore, type TabId } from "../useTabStore";

// Define the structure for the pagination cursor
type PageParam =
  | {
      cursor: string | null;
      nextUnlistedCursor: string | null;
    }
  | undefined;

// Function to fetch chats and unlisted users
const fetchChatsAndUnlistedUsers = async ({
  pageParam = { cursor: null, nextUnlistedCursor: null },
  searchValue = "",
  filter = "all",
}: {
  pageParam?: PageParam;
  searchValue?: string;
  filter?: TabId;
}): Promise<{
  chats: ChatConversation[];
  nextCursor: string | null;
  totalChatMembersCount: number;
  unlistedUsers: UnlistedUser[];
  nextUnlistedCursor: string | null;
}> => {
  const { data } = await axiosInstance.get("/chat/get-chats", {
    params: {
      cursor: pageParam?.cursor,
      nextUnlistedCursor: pageParam?.nextUnlistedCursor,
      take: 10,
      search: searchValue || undefined,
      filter,
    },
  });
  return data;
};

// Hook to fetch chats with react-query and update Zustand store
export const useChats = () => {
  const searchValue = useChatStore(useShallow((state) => state.searchValue)); // Use Zustand state with shallow comparison
  const { activeTab } = useTabStore(useShallow((state) => state));
  const { chats } = useChatStore();

  // Initialize useInfiniteQuery
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, ...rest } =
    useInfiniteQuery({
      queryKey: ["chats", searchValue, activeTab], // Include searchValue and activeTab in the key
      queryFn: ({ pageParam }: { pageParam?: PageParam }) =>
        fetchChatsAndUnlistedUsers({ pageParam, searchValue, filter: activeTab }),
      getNextPageParam: (lastPage) => {
        if (lastPage.nextCursor || lastPage.nextUnlistedCursor) {
          return {
            cursor: lastPage.nextCursor,
            nextUnlistedCursor: lastPage.nextUnlistedCursor,
          };
        }
        return undefined; // No next page
      },
      initialPageParam: { cursor: null, nextUnlistedCursor: null },
      staleTime: 1000 * 60 * 5, // 5 minutes
      select: (data) => {
        if (chats[activeTab]) {
          // Create a Set to track unique chat IDs
          const chatIds = new Set();
          // Merge chats from Zustand and fetched chats, filtering out duplicates
          const mergedChats = [
            ...chats[activeTab],
            ...data.pages.flatMap((page) => page.chats),
          ].filter((chat) => {
            if (chatIds.has(chat.id)) {
              return false; // Duplicate found, exclude it
            }
            chatIds.add(chat.id);
            return true;
          });

          // Return transformed data with merged and deduplicated chats
          return {
            ...data,
            pages: data.pages.map((page, index) => ({
              ...page,
              chats: index === 0 ? mergedChats : page.chats, // Only modify the first page for simplicity
            })),
          };
        }
        return data;
      },
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    ...rest,
  };
};

