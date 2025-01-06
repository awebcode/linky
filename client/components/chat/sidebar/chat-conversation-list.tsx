import { ConversationCard } from "./conversation-card";
import { useChatStore } from "@/hooks/useChatStore";
import { useCallback, useEffect } from "react";
import { useChats } from "@/hooks/chats/useChats";
import { ConversationCardSkeleton } from "../skeletons/ConversationCardSkeleton";
import { Loader } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { UnlistedUserCard } from "./unlisted-user-card";
import { getChatsHeading } from "@/lib/chat.utils";
import { useTabStore } from "@/hooks/useTabStore";
import InfiniteFeed from "../InfiniteFeed";

export function ChatConversationList() {
  const { activeTab } = useTabStore(useShallow((state) => state));
  const {
    chats,
    setChats,
    setUnlistedUsers,
    searchValue,
    setFilteredChats,
    getDisplayedChats,
    getDisplayedUnlistedUsers,
  } = useChatStore(useShallow((state) => state));

  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } = useChats();

  useEffect(() => {
    if (data) {
      const chats = data.pages.flatMap((page) => page.chats);
      const unlistedUsers = data.pages.flatMap((page) => page.unlistedUsers);
     console.log({activeTab, chats, unlistedUsers,total:data.pages[0].totalChatMembersCount})
      setChats(activeTab, chats, data.pages[0].totalChatMembersCount);
      setUnlistedUsers(unlistedUsers);
      setFilteredChats({ chats, unlistedChats: unlistedUsers }, activeTab);
    }
  }, [data, setChats, setUnlistedUsers, setFilteredChats, activeTab]);

  const loadMoreItems = useCallback(() => {
    if (hasNextPage && !isFetching && !isLoading) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching, isLoading]);

  const displayedChats = getDisplayedChats(activeTab);
  const displayedUnlistedUsers = getDisplayedUnlistedUsers();

  return (
    <div className="py-3 flex flex-col">
      <h2 className="px-4 text-sm font-semibold mb-2">
        {isLoading ? (
          <Loader className="animate-spin text-primary h-4 w-4 m-1" />
        ) : (
          getChatsHeading(searchValue, activeTab, displayedChats, displayedUnlistedUsers)
        )}
      </h2>

      <div className="scrollbar-hide h-[calc(100vh-320px)] md:h-[calc(100vh-360px)] overflow-auto px-2">
        {isLoading &&
          chats[activeTab]?.length === 0 &&
          Array.from({ length: 10 }).map((_, index) => (
            <ConversationCardSkeleton key={index} />
          ))}

        {error &&
          !isLoading &&
          displayedChats?.length === 0 &&
          displayedUnlistedUsers?.length === 0 && (
            <div className="text-red-500 text-center">Something went wrong</div>
          )}

        {!isLoading &&
          displayedChats?.length === 0 &&
          displayedUnlistedUsers?.length === 0 && (
            <div className="text-center text-muted-foreground py-4 m-1">
              <h3 className="text-primary">No Chats Available</h3>
              <p className="text-sm">You don&apos;t have any conversations yet.</p>
            </div>
          )}

        <div className="space-y-2 my-2 h-full">
          <InfiniteFeed
            itemCount={displayedChats?.length || 0}
            loadMore={loadMoreItems}
            renderItem={({ ref, index }) => {
              return (
                <ConversationCard
                  ref={ref}
                  conversation={displayedChats[index]}
                />
              );
            }}
          />
          {/* {displayedChats?.map((conversation) => (
            <ConversationCard key={conversation.id} conversation={conversation} />
          ))} */}
        </div>

        {searchValue && displayedUnlistedUsers?.length > 0 && (
          <div className="space-y-2 my-2">
            {displayedChats?.length > 0 && (
              <h3 className="text-primary text-sm font-semibold px-4">Unlisted Users</h3>
            )}
            {displayedUnlistedUsers.map((user) => (
              <UnlistedUserCard key={user.id} user={user} />
            ))}
          </div>
        )}

        {hasNextPage && !isLoading && !isFetching && (
          <div>
            {Array.from({ length: 3 }).map((_, index) => (
              <ConversationCardSkeleton key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
