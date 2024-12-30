import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationCard } from "./conversation-card";
import { useChatStore } from "@/hooks/useChatStore";
import { useEffect } from "react";
import { useChats } from "@/hooks/chats/useChats";
import { ConversationCardSkeleton } from "../skeletons/ConversationCardSkeleton";
import { Loader } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useShallow } from "zustand/react/shallow";

export function ChatConversationList() {
  const setChats = useChatStore((state) => state.setChats);
  const chats = useChatStore(useShallow((state) => state.chats));

  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } = useChats();
  const { ref, inView } = useInView({
    threshold: 0.8, // Trigger when 80% of the element is visible
    triggerOnce: false, // Allow multiple triggers for pagination
  });

  // Update chats in Zustand store when new data arrives
  useEffect(() => {
    if (data) {
      setChats(
        data.pages.flatMap((page) => page.chats),
        data.pages[0].totalCount
      );
    }
  }, [data, setChats]);

  // Fetch next page when the observer comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className="py-3 flex flex-col">
      <h2 className="px-4 text-sm font-semibold mb-2">Recent Chats</h2>
      <div className="custom-scrollbar h-[calc(100vh-320px)]   md:h-[calc(100vh-360px)] overflow-y-auto px-2">
        {/* Loading skeleton */}
        {isLoading &&
          chats?.length === 0 &&
          Array.from({ length: 10 }).map((_, index) => (
            <ConversationCardSkeleton key={index} />
          ))}

        {error && !isLoading && chats?.length === 0 && (
          <div className="text-red-500 text-center">Something went wrong</div>
        )}

        {/* No chats message */}
        {!isLoading && chats?.length === 0 && (
          <div className="text-center text-muted-foreground py-4 m-1">
            <h3 className="text-primary">No Chats Available</h3>
            <p className="text-sm">You don&apos;t have any conversations yet.</p>
          </div>
        )}

        {/* Conversations list */}
        <div className="space-y-2 my-2">
          {chats?.length > 0 &&
            chats.map((conversation) => (
              <div key={conversation.id} className="w-full">
                <ConversationCard conversation={conversation} />
              </div>
            ))}
        </div>

        {/* Infinite Scroll Trigger */}
        {hasNextPage && !isLoading && !isFetching && (
          <div ref={ref} className="flex justify-center py-4">
            <Loader className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
