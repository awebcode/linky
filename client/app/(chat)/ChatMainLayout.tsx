"use client";
import { NoChatSelected } from "@/components/chat/no-chat-selected";
import {  ChatSideNavigation } from "@/components/chat/sidebar/chat-side-navigation";
import DynamicSidebarRenderer from "@/components/chat/sidebar/dynamic-sidebar-renderer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatStore } from "@/hooks/useChatStore";
import { useShallow } from 'zustand/react/shallow'
export default function ChatMainLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const selectedChat = useChatStore(useShallow((state) => state.selectedChat));
  // useIsOnline()
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen w-full">
        {/* Conditionally render the Dynamic Sidebar or Main Content */}
        {selectedChat ? (
          <main className="flex-1 h-full">{children}</main>
        ) : (
          <aside className="flex-1 h-full">
            <DynamicSidebarRenderer />
          </aside>
        )}

        {/* Fixed Chat Navigation at the Bottom of the Screen for mobile */}
        <>
          {!selectedChat && <ChatSideNavigation />}
        </>
      </div>
    );
  }

  // Desktop layout
  return (
    <ResizablePanelGroup direction="horizontal" className="flex h-screen w-screen">
      <ResizablePanel defaultSize={5} minSize={0} maxSize={5}>
        <aside className="h-full border-r">
          <ChatSideNavigation />
        </aside>
      </ResizablePanel>
      {/* Resizable Handle */}
      <ResizableHandle withHandle />
      {/* Dynamic Sidebar (28%) */}
      <ResizablePanel defaultSize={28} minSize={20} maxSize={30}>
        <aside className="h-full border-r">
          <DynamicSidebarRenderer />
        </aside>
      </ResizablePanel>
      {/* Resizable Handle */}
      <ResizableHandle withHandle />
      {/* Main Content (Remaining Space) */}
      <ResizablePanel defaultSize={67} minSize={60}>
        <main className="h-full flex-1">
          {selectedChat ? (
            children
          ) : (
            <div className="h-screen flex-center">
              <NoChatSelected />
            </div>
          )}
        </main>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
