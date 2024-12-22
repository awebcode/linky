import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import UserActionDropdown from "./sidebar/user-action-dropdown";
import IconButton from "../common/IconButton";
import { EllipsisVertical } from "lucide-react";
import { messageRightSideMenuItems } from "@/constants/chat/menus";

interface ChatMessageProps {
  content: string;
  timestamp: Date;
  isOwn: boolean;
  avatar: string;
  userName: string;
}

export function ChatMessage({
  content,
  timestamp,
  isOwn,
  avatar,
  userName,
}: ChatMessageProps) {
  return (
    <div className={cn("flex gap-3 mb-4", isOwn && "flex-row-reverse")}>
      <Avatar>
        <AvatarImage src={avatar} alt={userName} />
        <AvatarFallback>{userName[0]}</AvatarFallback>
      </Avatar>

      {/* Message container */}
      <div className={cn("flex flex-col max-w-[70%] relative", isOwn && "items-end")}>
        <span className="text-sm text-muted-foreground mb-1">{userName}</span>

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            isOwn
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-muted rounded-tl-none"
          )}
        >
          <p className="text-sm">{content}</p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
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
}
