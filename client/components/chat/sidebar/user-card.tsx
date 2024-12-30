import UserAvatar from "@/components/common/UserAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserCardProps {
  user: {
    id: number;
    name: string;
    avatar: string;
    isOnline: boolean;
  };
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer">
      <UserAvatar src={user.avatar} fallback={user.name} isOnline={user.isOnline} size="sm" />

      <span className="text-xs font-medium truncate w-14 text-center">{user.name}</span>
    </div>
  );
}
