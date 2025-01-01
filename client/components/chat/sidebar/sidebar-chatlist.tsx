import React from "react";
import {  useTabStore, type TabId } from "@/hooks/useTabStore";
import { Badge } from "@/components/ui/badge";
import { ChatConversationList } from "./chat-conversation-list";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "@/hooks/useChatStore";
import { getChatsCount } from "@/lib/chat.utils";

const SidebarChatList = () => {
  const { activeTab, setActiveTab } = useTabStore();
  const {searchValue, unlistedUsers, chats} = useChatStore(useShallow((state) => state));
// Define the SIDEBAR_TABS array with explicit `as const`
 const SIDEBAR_TABS = [
   {
     id: "all",
     label: "All",
     count: getChatsCount(searchValue, chats, unlistedUsers),
     badgeColor: "bg-blue-100 text-blue-600",
   },
   { id: "unread", label: "Unread", count: 5, badgeColor: "bg-red-100 text-red-600" },
   {
     id: "favorite",
     label: "Favorite",
     count: 8,
     badgeColor: "bg-yellow-100 text-yellow-600",
   },
   { id: "groups", label: "Groups", count: 3, badgeColor: "bg-green-100 text-green-600" },
 ]; 

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
              <Badge
                className={`ml-1   text-xs py-0.5 px-1.5 ${tab.badgeColor} `}
              >
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Tab Content */}
      {activeTab === "all" && <ChatConversationList />}
      {activeTab === "unread" && (
        <div className="text-gray-700 dark:text-gray-200">
          Unread chats will be displayed here.
        </div>
      )}
      {activeTab === "favorite" && (
        <div className="text-gray-700 dark:text-gray-200">
          Favorite chats will be displayed here.
        </div>
      )}
      {activeTab === "groups" && (
        <div className="text-gray-700 dark:text-gray-200">
          Groups will be displayed here.
        </div>
      )}
    </div>
  );
};

export default SidebarChatList;
