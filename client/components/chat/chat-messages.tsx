import React, { useEffect, useCallback } from "react";
import { useMessagesInfiniteQuery } from "@/hooks/messages/useMessage"; // Example hook for data fetching
import { ChatMessage } from "./chat-message"; // Example component to render messages
import InfiniteFeed from "./InfiniteFeed";
import { useChatStore } from "@/hooks/useChatStore";
import { useShallow } from "zustand/react/shallow";
import { useMessageStore } from "@/hooks/useMessageStorage";
import { Loader } from "lucide-react";
import TypingIndicator from "./indicators/message-typing-indicator";

export function ChatMessages() {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useMessagesInfiniteQuery();
  const { selectedChat } = useChatStore(useShallow((state) => state));
  const { messages, setMessages } = useMessageStore(useShallow((state) => state));
  const loadMoreItems = useCallback(() => {
    if (hasNextPage && !isFetching && !isLoading) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching, isLoading]);

  useEffect(() => {
    if (data) {
      const chats = data.pages.flatMap((page) => page.messages);
      setMessages(selectedChat!.chatId, chats, data.pages[0].totalMessagesCount); // Update messages with new data from the API
    }
  }, [data, setMessages, selectedChat]);

  return (
    <>
      {/* Fetching and rendering messages with React-window Virtualized List */}
      <InfiniteFeed
        reversed
        itemCount={messages[selectedChat!.chatId]?.length || 0}
        loadMore={loadMoreItems}
        renderItem={({ ref, index }) => {
          return (
            <ChatMessage ref={ref} message={messages[selectedChat!.chatId][index]} />
          );
        }}
      />

      {/* Optional: Display loading spinner while fetching more items */}
      {isFetching && (
        <div className="flex w-full justify-center p-2">
          <Loader className="animate-spin text-primary h-6 w-6" />
        </div>
      )}
    </>
  );
}
