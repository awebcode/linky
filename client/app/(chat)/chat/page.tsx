"use client";
import TypingIndicator from "@/components/chat/indicators/message-typing-indicator";
import dynamic from "next/dynamic";

// Dynamically import the components with ssr: false
const ChatHeader = dynamic(
  () => import("@/components/chat/chat-header").then((mod) => mod.ChatHeader),
  {
    ssr: false,
  }
);
const ChatMessages = dynamic(
  () => import("@/components/chat/chat-messages").then((mod) => mod.ChatMessages),
  {
    ssr: false,
  }
);
const ChatInput = dynamic(
  () => import("@/components/chat/chat-input").then((mod) => mod.ChatInput),
  {
    ssr: false,
  }
);

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen w-full p-2">
      <div className="flex-none">
        <ChatHeader />
      </div>
      <div className="flex-grow">
        {" "}
        {/* Overflow-auto */}
        {/* Chat messages */}
        <ChatMessages />
        {/* Typing indicator */}
      </div>
      <div className="flex-none">
        <TypingIndicator />

        <ChatInput />
      </div>
    </div>
  );
}
