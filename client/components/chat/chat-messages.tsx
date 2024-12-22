import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";

interface ChatMessagesProps {
  messages: any[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
      </div>
    </ScrollArea>
  );
}