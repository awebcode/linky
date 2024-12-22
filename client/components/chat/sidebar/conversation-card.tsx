import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ConversationCardProps {
  conversation: {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: Date;
    unreadCount: number;
    isOnline: boolean;
  };
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="p-2 hover:bg-accent rounded-lg cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                <AvatarFallback>{conversation.name[0]}</AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                  conversation.isOnline ? "bg-green-500" : "bg-muted"
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium truncate">{conversation.name}</h3>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(conversation.timestamp, { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.lastMessage}
                </p>
                {conversation.unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <ContextMenuContent>
          <ContextMenuItem>View Profile</ContextMenuItem>
          <ContextMenuItem>Call</ContextMenuItem>
          <ContextMenuItem>Mute</ContextMenuItem>
          <ContextMenuItem>Block</ContextMenuItem>

          <ContextMenuItem>Report</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Delete Conversation</ContextMenuItem>
          <ContextMenuItem>Clear Chat History</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenuTrigger>
    </ContextMenu>
  );
}