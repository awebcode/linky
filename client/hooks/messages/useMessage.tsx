import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../useChatStore";
import { useShallow } from "zustand/react/shallow";
import axiosInstance from "@/config/axiosInstance";
import useCustomMutationHook from "@/hooks/use-custom-mutation";
import type { CreateMessageInput, MessageResponse } from "@/types/message";
import { useMessageStore } from "../useMessageStorage";

// Function to send a message and handle success/error
export const useMessageMutation = (redirectPath?: string) => {
  const queryClient = useQueryClient();
  return useCustomMutationHook(
    async (data: CreateMessageInput) => {
      const response = await axiosInstance.post("/message/send-message", data);
      return response.data;
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries({ queryKey: ["chats"] });
        console.log("Message sent successfully");
      },
      onError: (error) => {
        console.error("Error sending message:", error);
      },
    },
    redirectPath
  );
};

// Define the structure for the pagination cursor
type PageParam = { cursor: string | null } | undefined;

// Function to fetch messages with cursor pagination and optional search
const fetchMessages = async ({
  pageParam = { cursor: null },
  searchValue = "",
  selectedChatId,
}: {
  pageParam?: PageParam;
  searchValue?: string;
  selectedChatId?: string; // Chat ID passed as parameter
}): Promise<{
  messages: MessageResponse[];
  totalMessagesCount: number;
  nextCursor: string | null;
}> => {
  const { data } = await axiosInstance.get(`/message/get-messages/${selectedChatId}`, {
    params: {
      cursor: pageParam?.cursor,
      take: 15,
      search: searchValue || undefined,
    },
  });
  return data;
};

// Hook to fetch messages with infinite query and update Zustand store
export const useMessagesInfiniteQuery = () => {
  const { selectedChat } = useChatStore(useShallow((state) => state));
  const { messages,totalMessagesCount} = useMessageStore(useShallow((state) => state));

  // Hydrate React Query cache with Zustand's data if available
  

  // Use react-query's infinite query
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, ...rest } =
    useInfiniteQuery({
      queryKey: ["messages", selectedChat!.chatId], // Include selectedChat!.chatId for cache uniqueness
      queryFn: ({ pageParam }: { pageParam?: PageParam }) =>
        fetchMessages({
          pageParam,
          searchValue: "",
          selectedChatId: selectedChat!.chatId,
        }), // Fetching logic
      getNextPageParam: (lastPage) => {
        // Pagination logic to get next cursor
        return lastPage.nextCursor ? { cursor: lastPage.nextCursor } : undefined;
      },
      initialPageParam: { cursor: null } as any, // Initial cursor for the first page
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes to avoid frequent re-fetching
      select: (data) => {
        // Transform data based on Zustand store
        if (messages[selectedChat!.chatId]) {
          // Create a Set to track unique message IDs
          const messageIds = new Set();
          // Merge messages from Zustand and fetched messages, filtering out duplicates
          const mergedMessages = [
            ...messages[selectedChat!.chatId],
            ...data.pages.flatMap((page) => page.messages),
          ].filter((message) => {
            if (messageIds.has(message.id||message?.tempId)) {
              return false; // Duplicate found, exclude it
            }
            messageIds.add(message.id||message?.tempId);
            return true;
          });

          // Return transformed data with merged and deduplicated messages
          return {
            ...data,
            pages: data.pages.map((page, index) => ({
              ...page,
              
              totalMessagesCount: totalMessagesCount[selectedChat!.chatId]>page.totalMessagesCount?totalMessagesCount[selectedChat!.chatId]:page.totalMessagesCount,
              
              messages: index === 0 ? mergedMessages : page.messages, // Only modify the first page for simplicity
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
