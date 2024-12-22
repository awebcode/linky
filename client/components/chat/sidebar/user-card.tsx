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
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <span className={cn(
          "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
          user.isOnline ? "bg-green-500" : "bg-muted"
        )} />
      </div>
      <span className="text-xs font-medium truncate w-14 text-center">
        {user.name}
      </span>
    </div>
  );
}