import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
}

export function ConversationList({ conversations }: ConversationListProps) {
  return (
    <div className="py-4">
      <h2 className="px-4 text-sm font-semibold mb-2">Recent Chats</h2>
      <ScrollArea className="px-2">
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className="w-full p-2 flex items-center gap-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="relative">
                <Avatar user={{ ...conversation, id: conversation.id }} />
                <span className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                  conversation.isOnline ? "bg-green-500" : "bg-gray-300"
                )} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{conversation.name}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(conversation.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-purple-500 text-white rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}