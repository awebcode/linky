import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import {User} from "@prisma/client";
interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  return (
    <div className="py-4">
      <h2 className="px-4 text-sm font-semibold mb-2">Active Now</h2>
      <ScrollArea className="px-4">
        <div className="flex gap-3 pb-4">
          {users.map((user) => (
            <div key={user.id} className="flex flex-col items-center gap-1">
              <div className="relative">
                <Avatar user={user} />
                <span className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                  user.isOnline ? "bg-green-500" : "bg-gray-300"
                )} />
              </div>
              <span className="text-xs font-medium truncate w-14 text-center">
                {user.name}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}