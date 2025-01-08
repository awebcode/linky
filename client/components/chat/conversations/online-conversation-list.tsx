import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { OnlineUserCard } from "./online-conversation-card";
import { useShallow } from "zustand/react/shallow";
import { useOnlineConversationsStore } from "@/hooks/useOnlineConversations";
import { useChatStore } from "@/hooks/useChatStore";
import {
  useFetchNotExistsOnlineSelectedChat,
  useOnlineChats,
} from "@/hooks/chats/use-online-chats";
import { useEffect, useState } from "react";
import { OnlineUserCardSkeleton } from "../skeletons/OnlineUserCardSkeleton";
import { Loader } from "lucide-react";

export function OnlineUserList() {
  const { setSelectedChat, chats } = useChatStore(useShallow((state) => state));
  const { data, isLoading } = useOnlineChats();
  const {
    addInitialOnlineConversations,
    onlineConversations,
    totalOnlineChatMembersCount,
  } = useOnlineConversationsStore(useShallow((state) => state));

  // State for the chatId to fetch dynamically
  const [chatIdToFetch, setChatIdToFetch] = useState<string | null>(null);

  // Only call `useChats` when `chatIdToFetch` exists
  const { data: chatsData, isFetching: isFetchingChats } =
    useFetchNotExistsOnlineSelectedChat(
      chatIdToFetch ? [chatIdToFetch] : [],
      1,
      !!chatIdToFetch
    );

  // Handle setting the selected chat after fetching
  useEffect(() => {
    if (chatsData && !isFetchingChats && chatsData?.chats?.length > 0) {
      setSelectedChat(chatsData.chats.filter((chat) => chat.chatId === chatIdToFetch)[0]);
    }
  }, [chatsData, setSelectedChat, isFetchingChats, chatIdToFetch]);

  // Initialize online conversations when data is loaded
  useEffect(() => {
    if (data) {
      const chatMembers = data.pages[0].onlineChatMembers;
      const totalCount = data.pages[0].totalOnlineChatMembersCount;
      addInitialOnlineConversations(chatMembers, totalCount);
    }
  }, [data, addInitialOnlineConversations]);

  if (isLoading )
    return <OnlineUserCardSkeleton length={onlineConversations.length || 10} />;
  if (!isLoading && onlineConversations.length === 0) return null;

  const handleChatClick = (chatId: string) => {
    const existingChat = chats["all"].find((chat) => chat.chatId === chatId);
    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      console.log("Fetching missing chat data...");
      setChatIdToFetch(chatId); // Trigger fetching for the missing chat
    }
  };

  return (
    <div className="py-3 border-b">
      <h2 className="px-4 text-sm font-semibold">
        Active Chats ({totalOnlineChatMembersCount})
      </h2>

      <ScrollArea className="flex-1 px-4 py-2">
        <div className="flex gap-3">
          {onlineConversations
            .filter(
              (chatMember, index, self) =>
                self.findIndex((m) => m.onlineUser.id === chatMember.onlineUser.id) ===
                index
            )
            .map((chatMember) => (
              <OnlineUserCard
                key={chatMember.chatId}
                user={chatMember.onlineUser}
                onChatClick={() => handleChatClick(chatMember.chatId)}
              />
            ))}
          {isFetchingChats && (
            <div className="flex items-center justify-center">
              <Loader className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}
          {totalOnlineChatMembersCount > onlineConversations.length && (
            <span className="text-primary cursor-pointer hover:underline">
              View more ({totalOnlineChatMembersCount - onlineConversations.length})
            </span>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
