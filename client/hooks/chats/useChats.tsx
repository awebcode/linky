import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";
import type { ChatConversation } from "@/types/chat";
import { useChatStore } from "../useChatStore";
import { useShallow } from "zustand/shallow";
import type { UnlistedUser } from "@/types/user";

// Define the structure for the pagination cursor
type PageParam = {
  cursor: string | null;
  nextUnlistedCursor: string | null;
}|undefined;

// Function to fetch chats and unlisted users
const fetchChatsAndUnlistedUsers = async ({
  pageParam = { cursor: null, nextUnlistedCursor: null },
  searchValue = "",
}: {
  pageParam?: PageParam;
  searchValue?: string;
}): Promise<{
  chats: ChatConversation[];
  nextCursor:string | null;
  totalCount: number;
  unlistedUsers: UnlistedUser[];
  nextUnlistedCursor: string | null;
}> => {
  const { data } = await axiosInstance.get("/chat/get-chats", {
    params: {
      cursor: pageParam.cursor,
      nextUnlistedCursor: pageParam.nextUnlistedCursor,
      take: 8,
      search: searchValue || undefined,
    },
  });
  return data;
};

// Hook to fetch chats with react-query and update Zustand store
export const useChats = () => {
  const searchValue = useChatStore(useShallow((state) => state.searchValue)); // Use Zustand state with shallow comparison

  return useInfiniteQuery({
    queryKey: ["chats", searchValue], // Include searchValue in the key to refetch on change
    queryFn: ({ pageParam }: { pageParam?: PageParam }) => fetchChatsAndUnlistedUsers({ pageParam, searchValue }),
    getNextPageParam: (lastPage) => {
      // Return the next page param structure, based on the previous page's response
      if (lastPage.nextCursor != null || lastPage.nextUnlistedCursor != null) {
        return {
          cursor: lastPage.nextCursor,
          nextUnlistedCursor: lastPage.nextUnlistedCursor,
        };
      }
      return undefined; // No next page
    },
    initialPageParam: { cursor: null, nextUnlistedCursor: null }, // Start with null cursors for first page
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

