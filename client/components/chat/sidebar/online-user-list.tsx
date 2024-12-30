import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UserCard } from "./user-card";
import { users } from "@/constants/data/users";

export function OnlineUserList() {
  if (!users.length) return null;

  return (
    <div className="py-3 border-b">
      <h2 className="px-4 text-sm font-semibold">Active Chats</h2>
      
      <ScrollArea className="flex-1 px-4 py-2">
        <div className="flex gap-3">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
