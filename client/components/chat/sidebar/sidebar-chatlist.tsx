import React from "react";
import {  useTabStore, type TabId } from "@/hooks/useTabStore";
import { Badge } from "@/components/ui/badge";
import { ChatConversationList } from "./chat-conversation-list";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "@/hooks/useChatStore";
import { getChatsCount } from "@/lib/chat.utils";
import { useCountStore } from "@/hooks/countStore";

const SidebarChatList = () => {
  const { activeTab, setActiveTab } = useTabStore((state) => state);
  const {searchValue, getDisplayedChats,getDisplayedUnlistedUsers} = useChatStore(useShallow((state) => state));
  const {chatsCount}=useCountStore(useShallow((state) => state));
  const displayedChats = getDisplayedChats(activeTab);
  const displayedUnlistedUsers = getDisplayedUnlistedUsers();
  const {chats}=useChatStore(useShallow((state) => state));
  // Define the SIDEBAR_TABS array with explicit `as const`
  const count=getChatsCount(searchValue, displayedChats, displayedUnlistedUsers)
 const SIDEBAR_TABS = [
   {
     id: "all",
     label: "All",
     count: chatsCount.totalChatsCount,
     badgeColor: "bg-blue-100 text-blue-600",
   },
   {
     id: "groups",
     label: "Groups",
     count: chatsCount.groupChatsCount,
     badgeColor: "bg-green-100 text-green-600",
   },
   {
     id: "unread",
     label: "Unread",
     count: chatsCount.unreadChatsCount>0?chatsCount.unreadChatsCount:chats["unread"]?.length||0,
     badgeColor: "bg-red-100 text-red-600",
   },
   {
     id: "favorite",
     label: "Favorite",
     count:
       chatsCount.favoriteChatsCount===0 ? chats["favorite"]?.length||0 : 0,
     badgeColor: "bg-yellow-100 text-yellow-600",
   },
   {
     id: "pinned",
     label: "Pinned",
     count: chatsCount.pinnedChatsCount===0 ? chats["pinned"]?.length : 0,
     badgeColor: "bg-blue-100 text-blue-600",
   },
   {
     id: "Muted",
     label: "Muted",
     count: chatsCount.mutedChatsCount===0 ? chats["muted"]?.length : 0,
     badgeColor: "bg-gray-100 text-gray-600",
   },

   {
     id: "Archived",
     label: "Archived",
     count: chatsCount.archivedChatsCount===0 ? chats["archived"]?.length : 0,
     badgeColor: "bg-violet-100 text-violet-600",
   },
   {
     id: "Blocked",
     label: "Blocked",
     count: chatsCount.blockedChatsCount===0 ? chats["blocked"]?.length : 0,
     badgeColor: "bg-red-100 text-red-600",
   },
 ]; 
console.log({chats})
  return (
    <div>
      {/* Tab List */}
      <ScrollArea>
        <div className="flex gap-1 p-1 border-b ">
          {SIDEBAR_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`px-2 py-1 rounded-lg text-sm font-medium flex items-center transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white"
                  : "bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {tab.label}
              <Badge className={`ml-1   text-xs py-0.5 px-1.5 ${tab.badgeColor} `}>
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Tab Content */}
      <ChatConversationList />
      {/* {activeTab === "all" && <ChatConversationList />}
      {activeTab === "unread" && <ChatConversationList />}
      {activeTab === "favorite" && <ChatConversationList />}
      {activeTab === "groups" && <ChatConversationList />} */}
    </div>
  );
};

export default SidebarChatList;
