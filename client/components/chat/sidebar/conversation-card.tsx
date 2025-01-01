import UserAvatar from "@/components/common/UserAvatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useChatStore } from "@/hooks/useChatStore";
import { cn } from "@/lib/utils";
import type { ChatConversation } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { useShallow } from "zustand/react/shallow";
import { useMessageStore } from "@/hooks/useMessageStorage";

interface ConversationCardProps {
  conversation: ChatConversation;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const selectedChat = useChatStore(useShallow((state) => state.selectedChat));
  const { message } = useMessageStore(useShallow((state) => state));

  const {
    isGroup,
    groupInfo,
    user: { status, name, image },
  } = conversation;

  // Get the draft message for the current conversation
  const draftMessage = message[conversation.id] || "";

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onClick={() => setSelectedChat(conversation)}
          className={cn(
            " p-2 my-1 hover:bg-accent dark:hover:bg-gray-900 rounded-lg cursor-pointer transition-colors",
            { "bg-gray-200 dark:bg-gray-800": selectedChat?.id === conversation.id }
          )}
        >
          <div className="flex items-center gap-3">
            {isGroup ? (
              <UserAvatar
                src={groupInfo?.groupImage}
                fallback={groupInfo?.groupName}
                isOnline={false} // Groups don't have online status
                size="md"
              />
            ) : (
              <UserAvatar
                src={image}
                fallback={name}
                isOnline={status === "ONLINE"}
                size="md"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm truncate">
                  {isGroup ? groupInfo?.groupName : name}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(
                    conversation.lastMessage?.sentAt || conversation.createdAt,
                    {
                      addSuffix: true,
                    }
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between max-w-full">
                {draftMessage ? (
                  <>
                    <p className="text-sm  truncate font-semibold">
                      <span className="text-primary"> Draft:</span> {draftMessage}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage?.content}
                  </p>
                )}
                {conversation.unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>{isGroup ? "View Group Info" : "View Profile"}</ContextMenuItem>
        {isGroup ? (
          <>
            <ContextMenuItem>Leave Group</ContextMenuItem>
          </>
        ) : (
          <>
            <ContextMenuItem>Call</ContextMenuItem>
            <ContextMenuItem>Mute</ContextMenuItem>
            <ContextMenuItem>Block</ContextMenuItem>
          </>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem>
          {isGroup ? "Delete Group Chat" : "Delete Conversation"}
        </ContextMenuItem>
        <ContextMenuItem>Clear Chat History</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
