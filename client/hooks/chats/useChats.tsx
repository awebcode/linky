import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";
import type { ChatConversation } from "@/types/chat";
import { useChatStore } from "../useChatStore";
import { useShallow } from "zustand/react/shallow";

// Fetch function to get chats with pagination and search
const fetchChats = async ({
  pageParam = 0,
  searchValue = "",
}: {
  pageParam?: number;
  searchValue?: string;
}): Promise<{
  chats: ChatConversation[];
  nextCursor: number | null;
  totalCount: number;
}> => {
  const { data } = await axiosInstance.get("/chat/get-chats", {
    params: {
      cursor: pageParam !== 0 ? pageParam : undefined,
      take: 8,
      search: searchValue || undefined, // Avoid sending empty search queries
    },
  });
  return data;
};

// Hook to fetch chats with react-query and update Zustand store
export const useChats = () => {
  const searchValue = useChatStore(useShallow((state) => state.searchValue)); // Zustand state

  return useInfiniteQuery({
    queryKey: ["chats", searchValue], // Include searchValue in the key to refetch on change
    queryFn: ({ pageParam }) => fetchChats({ pageParam, searchValue }),
    initialPageParam: 0, // Start with the first page
    getNextPageParam: (lastPage) => {
      if (lastPage.nextCursor) {
        return lastPage.nextCursor;
      }
    }, // Handle cases with no next cursor
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
