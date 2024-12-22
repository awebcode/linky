"use client"
import { Search } from "lucide-react";
import { ChatUserList } from "./chat-user-list";
import { ChatConversationList } from "./chat-conversation-list";
import { UserProfile } from "./user-profile";
import { Input } from "@/components/ui/input";

export function ChatSidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="hidden md:block">
        <UserProfile />
      </div>
      <div className="px-2 py-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search messages..."
            className="pl-9 pr-4 py-2 "
          />
        </div>
      </div>
      <div className="flex-1">
        <ChatUserList />
        <ChatConversationList />
      </div>
    </div>
  );
}
