"use client";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import UserAvatar from "@/components/common/UserAvatar";
import UserActionDropdown from "./user-action-dropdown";
import { userMenuItems } from "@/constants/chat/menus";

export function UserProfile() {
  const { user } = useUser();
  if(!user) return null
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <UserAvatar src={user?.image} fallback={user?.name} isOnline />
        <div>
          <h3 className="font-medium">{user?.name}</h3>
          <p className="text-sm text-muted-foreground">Online</p>
        </div>
      </div>
      <UserActionDropdown
        trigger={
          <Button size={"icon"} variant={"outline"}>
            <Settings className="w-5 h-5" />
          </Button>
        }
        items={userMenuItems}
      />
    </div>
  );
}
