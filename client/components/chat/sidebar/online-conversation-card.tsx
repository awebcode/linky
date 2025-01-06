import UserAvatar from "@/components/common/UserAvatar";
import { WithTooltip } from "@/components/common/WithTooltip";
import type { OnlineUser } from "@/types/chat";

interface UserCardProps {
  user: OnlineUser;
  onChatClick: () => void;
}

export function OnlineUserCard({ user, onChatClick }: UserCardProps) {
  return (
    <WithTooltip
      content={
        <div className="flex flex-col items-center gap-1">
          <UserAvatar
            src={user?.image}
            fallback={user.name}
            isOnline={user.status === "ONLINE"}
            size="sm"
          />
          <span className="text-xs font-medium truncate text-center">{user.name}</span>
        </div>
      }
    >
      <div
        onClick={onChatClick}
        aria-label="Online-ChatConversation-Card"
        className="flex flex-col items-center gap-1 cursor-pointer"
      >
        <UserAvatar
          src={user?.image}
          fallback={user.name}
          isOnline={user.status === "ONLINE"}
          size="sm"
        />
        <span className="text-xs font-medium truncate text-center">{user.name}</span>
      </div>
    </WithTooltip>
  );
}
