"use client";
// DynamicSidebarRenderer.tsx
import React from "react";

// Import components for each navigation
import {
  ChatNav,
  GroupsNav,
  ProfileNav,
  CallsNav,
  ContactsNav,
  NotificationsNav,
  SettingsNav,
} from "./navigations";
import { useNavStore, type NavId } from "@/hooks/useNavStore";
import { ChatSidebar } from "./chat-sidebar";

interface DynamicSidebarRendererProps {
  className?: "";
}

const DynamicSidebarRenderer: React.FC<DynamicSidebarRendererProps> = () => {
  const { activeNav } = useNavStore(); // Use 'activeNav' instead of 'activeTab'

  const renderNavContent = (navId: NavId) => {
    switch (navId) {
      case "chats":
        return <ChatSidebar />;
      case "groups":
        return <GroupsNav />;
      case "profile":
        return <ProfileNav />;
      case "calls":
        return <CallsNav />;
      case "contacts":
        return <ContactsNav />;
      case "notifications":
        return <NotificationsNav />;
      case "settings":
        return <SettingsNav />;
      default:
        return <div>No content available</div>;
    }
  };

  return <>{renderNavContent(activeNav)}</>;
};

export default DynamicSidebarRenderer;
