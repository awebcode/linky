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
import { forwardRef } from "react";
import { useTabStore } from "@/hooks/useTabStore";
import { WithTooltip } from "@/components/common/WithTooltip";
import CardTypingIndicator from "../indicators/card-typing-indicator";
import { useTypingStore } from "@/hooks/useTypingStore";
import { useUser } from "@/hooks/use-user";

interface ConversationCardProps {
  conversation: ChatConversation;
}

export const ConversationCard = forwardRef<HTMLDivElement, ConversationCardProps>(
  ({ conversation }, ref) => {
    const { typingUsers } = useTypingStore(useShallow((state) => state));
    const { activeTab } = useTabStore(useShallow((state) => state));
    const setSelectedChat = useChatStore((state) => state.setSelectedChat);
    const { selectedChat, pinChat, favoriteChat, deleteChat, markAsUnread } =
      useChatStore(useShallow((state) => state));
    const { message } = useMessageStore(useShallow((state) => state));
   
    const { user: currentUser } = useUser();
    const { isGroup, groupInfo, user: converSationUser } = conversation;
    // console.log({conversation})

    // Get the draft message for the current conversation
    const draftMessage = message[conversation.chatId] || "";
    // const isOnline = onlineUsersByChat[conversation.chatId]||conversation.totalOnlineUsers>0
    // Calculate isOnline status
    const isOnline = conversation?.onlineUsers.map((user) => user); // For direct chats, check onlineUsers list
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            ref={ref}
            onClick={() => setSelectedChat(conversation)}
            className={cn(
              "p-2 my-1 hover:bg-accent dark:hover:bg-gray-900 rounded-lg cursor-pointer transition-colors",
              {
                "bg-gray-200 dark:bg-gray-800":
                  selectedChat?.chatId === conversation.chatId,
              }
            )}
          >
            <WithTooltip
              side="bottom"
              content={
                <div className="flex flex-col items-center gap-1">
                  {/* {isGroup ? (
                    <UserAvatar
                      src={groupInfo?.groupImage}
                      fallback={groupInfo?.groupName}
                      isOnline={isOnline} // Groups don't have online status
                      size="md"
                    />
                  ) : (
                    <UserAvatar
                      src={image}
                      fallback={name}
                      isOnline={status === "ONLINE"}
                      size="md"
                    />
                  )} */}

                  <p>{isGroup ? groupInfo?.groupName : converSationUser?.name}</p>

                  <span className="text-xs text-primary">
                    {" "}
                    {conversation.membersCount} - Members
                  </span>
                  <span className="text-xs text-emerald-500">
                    {" "}
                    {isOnline?.length || 0} - Online
                  </span>
                </div>
              }
            >
              <div className="flex items-center gap-3">
                {isGroup ? (
                  <UserAvatar
                    src={groupInfo?.groupImage}
                    fallback={groupInfo?.groupName}
                    isOnline={isOnline?.length > 0} // Groups don't have online status
                    size="md"
                  />
                ) : (
                  <UserAvatar
                    src={converSationUser?.image}
                    fallback={converSationUser?.name}
                    isOnline={
                      converSationUser?.status === "ONLINE" || isOnline.length > 0
                    }
                    size="md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">
                      {isGroup ? groupInfo?.groupName : converSationUser?.name}
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
                    {typingUsers.filter((user) => user.chatId === conversation?.chatId)
                      .length > 0 ? (
                      <>
                        <CardTypingIndicator
                          chatId={conversation?.chatId}
                          userId={currentUser?.id}
                        />
                      </>
                    ) : draftMessage ? (
                      <>
                        <p className="text-sm truncate font-semibold">
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
            </WithTooltip>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => setSelectedChat(conversation)}>
            {isGroup ? "View Group Info" : "View Profile"}
          </ContextMenuItem>
          {isGroup ? (
            <>
              <ContextMenuItem onClick={() => pinChat(conversation.chatId, activeTab)}>
                Pin Group Chat
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => favoriteChat(conversation.chatId, activeTab)}
              >
                Favorite Group Chat
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => markAsUnread(conversation.chatId, activeTab)}
              >
                Mark as Unread
              </ContextMenuItem>
              <ContextMenuItem onClick={() => deleteChat(conversation.chatId, activeTab)}>
                Delete Group Chat
              </ContextMenuItem>
            </>
          ) : (
            <>
              <ContextMenuItem onClick={() => pinChat(conversation.chatId, activeTab)}>
                Pin Conversation
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => favoriteChat(conversation.chatId, activeTab)}
              >
                Favorite Conversation
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => markAsUnread(conversation.chatId, activeTab)}
              >
                Mark as Unread
              </ContextMenuItem>
              <ContextMenuItem onClick={() => deleteChat(conversation.chatId, activeTab)}>
                Delete Conversation
              </ContextMenuItem>
            </>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => deleteChat(conversation.chatId, activeTab)}>
            Clear Chat History
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }
);

ConversationCard.displayName = "ConversationCard";
