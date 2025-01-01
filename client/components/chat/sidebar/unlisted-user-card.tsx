import UserAvatar from "@/components/common/UserAvatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import type { UnlistedUser } from "@/types/user";
import { formatDistanceToNow } from "date-fns";

interface UnlistedUserCardProps {
  user: UnlistedUser;
}

export function UnlistedUserCard({ user }: UnlistedUserCardProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "p-2 my-1 hover:bg-accent dark:hover:bg-gray-900 rounded-lg cursor-pointer transition-colors"
          )}
        >
          <div className="flex items-center gap-3">
            <UserAvatar
              src={user.image}
              fallback={user.name}
              isOnline={user.status === "ONLINE"}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm truncate">{user.name}</h3>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(user.lastActive||Date.now(), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>View Profile</ContextMenuItem>
        <ContextMenuItem>Message</ContextMenuItem>
        <ContextMenuItem>Call</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Block</ContextMenuItem>
        <ContextMenuItem>Report</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
