import UserAvatar from "@/components/common/UserAvatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useCreateChatMutation } from "@/hooks/chats/useChatMutations";
import { cn } from "@/lib/utils";
import type { UnlistedUser } from "@/types/user";
import { formatDistanceToNow } from "date-fns";
import { Loader } from "lucide-react";

interface UnlistedUserCardProps {
  user: UnlistedUser;
}

export function UnlistedUserCard({ user }: UnlistedUserCardProps) {
  const createChatMutation = useCreateChatMutation();
  const handleCreateChat = () => {
    createChatMutation.mutate({
      members: [user.id],
      name: user.name,
      isGroupChat: false,
    });
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onClick={handleCreateChat}
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
                  {formatDistanceToNow(user.lastActive || Date.now(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
            {/* Loader positioned on top right */}
            {createChatMutation.isPending && (
              <div className="absolute top-2 right-2">
                <Loader className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>View Profile</ContextMenuItem>
        <ContextMenuItem onClick={handleCreateChat}>Message</ContextMenuItem>
        <ContextMenuItem>Create Group</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Block</ContextMenuItem>
        <ContextMenuItem>Report</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
