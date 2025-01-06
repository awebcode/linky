"use client"
import {  OnlineUserList } from "./online-conversation-list";
import { UserProfile } from "./user-profile";
import SidebarInput from "./sidebar-input";
import SidebarChatList from "./sidebar-chatlist";

export function ChatSidebar() {
  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="hidden md:block">
        <UserProfile />
      </div>
      <div className="px-2 py-3 border-b">
       <SidebarInput/>
      </div>
      <div className="flex-1">
        <OnlineUserList />
        <SidebarChatList/>
      </div>
    </div>
  );
}
