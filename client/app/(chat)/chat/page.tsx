"use client";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";

// This would typically come from your database
const messages= [
  {
    id: 1,
    content: "Hey! How's it going?",
    timestamp: new Date(Date.now() - 3600000),
    isOwn: false,
    userName: "Sarah Wilson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    id: 2,
    content: "Hi Sarah! I'm doing great, thanks for asking. How about you?",
    timestamp: new Date(Date.now() - 3000000),
    isOwn: true,
    userName: "You",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
  },
];

export default function ChatPage() {
  return (
    <div className="hidden md:flex flex-col h-full ">
      <ChatHeader
        avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
        name="Sarah Wilson"
        status="Online"
      />
      <ChatMessages messages={messages} />
      <ChatInput onSendMessage={console.log} />
    </div>
  );
}
