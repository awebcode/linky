import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";
import type { ChatConversation, GetOnlineConversationsResponse } from "@/types/chat";

// Define the structure for the pagination cursor
type PageParam =
  | {
      chatCursor: string | null;
      userCursor: string | null;
    }
  | undefined;

// Function to fetch chats and unlisted users
const fetchChatsAndUnlistedUsers = async ({
  pageParam = { chatCursor: null, userCursor: null },
  searchValue = "",
}: {
  pageParam?: PageParam;
  searchValue?: string;
}): Promise<{
  onlineChatMembers: GetOnlineConversationsResponse["onlineChatMembers"];
  totalOnlineChatMembersCount: number;
  nextChatCursor: string | null;
  nextUserCursor: string | null;
}> => {
  const { data } = await axiosInstance.get("/chat/get-online-conversations", {
    params: {
      chatCursor: pageParam?.chatCursor,
      userCursor: pageParam?.userCursor,
      take: 10,
      search: searchValue || undefined,
    },
  });

  return data
};

// Hook to fetch chats with react-query and update Zustand store
export const useOnlineChats = () => {
  //   const searchValue = useChatStore(useShallow((state) => state.searchValue)); // Use Zustand state with shallow comparison

  return useInfiniteQuery({
    queryKey: ["online-chats"], // Include searchValue and activeTab in the key
    queryFn: ({ pageParam }: { pageParam?: PageParam }) =>
      fetchChatsAndUnlistedUsers({ pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.nextChatCursor || lastPage.nextUserCursor) {
        return {
          chatCursor: lastPage.nextChatCursor,
          userCursor: lastPage.nextUserCursor,
        };
      }
      return undefined; // No next page
    },
    initialPageParam: { chatCursor: null, userCursor: null },
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};



// Function to fetch chats by chatIds
const fetchChatsByIds = async ({
  chatIds = [],
  limit = 10,
}: {
  chatIds: string[];
  limit?: number;
}): Promise<{
  chats: ChatConversation[];
}> => {
  const { data } = await axiosInstance.get("/chat/get-chats", {
    params: {
      chatIds,
      take: limit ?? 1,
    },
  });
  return data;
};

// Hook to fetch chats that don't exist on chatlist
export const useFetchNotExistsOnlineSelectedChat = (
  chatIds: string[] = [],
  limit: number = 1,
  isEnabled: boolean = false
) => {
  return useQuery({
    queryKey: ["notExistsOnlineChat", chatIds, limit],
    queryFn: () => fetchChatsByIds({ chatIds, limit }),
    enabled: isEnabled && chatIds.length > 0, // Only fetch when enabled and chatIds are provided
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};
