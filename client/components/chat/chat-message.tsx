import { forwardRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import UserActionDropdown from "./sidebar/user-action-dropdown";
import IconButton from "../common/IconButton";
import { EllipsisVertical } from "lucide-react";
import { messageRightSideMenuItems } from "@/constants/chat/menus";
import { MessageResponse } from "@/types/message";
import { useUser } from "@/hooks/use-user";

interface ChatMessageProps {
  message: MessageResponse;
}

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(({ message }, ref) => {
  const { user } = useUser(); // Get the current user from the store
  const isOwn = message?.sender.id === user.id; // Check if the message is from the current user
  if (!message) return null;

  return (
    <div ref={ref} className={cn("flex gap-3 mb-4 p-2", isOwn && "flex-row-reverse")}>
      {/* Avatar */}
      {isOwn ? (
        <></>
      ) : (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message?.sender?.image} />
          <AvatarFallback>{message?.sender?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      )}

      {/* Message container */}
      <div className={cn("flex flex-col max-w-[70%] relative", isOwn && "items-end")}>
        <span className="text-sm text-muted-foreground mb-1">
          {message?.sender?.name}
        </span>

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2 break-all",
            isOwn
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-muted rounded-tl-none"
          )}
        >
          <p className="text-sm">{message?.content}</p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(message?.sentAt), { addSuffix: true })}
        </span>

        {/* Dropdown for the action menu */}
        <div
          className={cn(
            "absolute top-3",
            isOwn ? "right-[100%]" : "left-[100%]", // Align to right for own messages, left for others
            "translate-y-[5px]" // Slight adjustment to avoid overlap with the message
          )}
        >
          <UserActionDropdown
            sideOffset={-10}
            trigger={
              <IconButton>
                <EllipsisVertical />
              </IconButton>
            }
            items={messageRightSideMenuItems}
          />
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";
