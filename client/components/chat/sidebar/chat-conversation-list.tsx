import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationCard } from "./conversation-card";
import { conversations } from "@/constants/data/conversations";

export function ChatConversationList() {
  return (
    <div className="py-3">
      <h2 className="px-4 text-sm font-semibold mb-2">Recent Chats</h2>
      <ScrollArea className="h-[calc(100vh-350px)] px-2">
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <ConversationCard key={conversation.id} conversation={conversation} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}