import { Phone, Video, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserActionDropdown from "./sidebar/user-action-dropdown";
import { chatRightSideMenuItems } from "@/constants/chat/menus";
import { Button } from "../ui/button";
import UserAvatar from "../common/UserAvatar";

interface ChatHeaderProps {
  avatar: string;
  name: string;
  status: string;
}

export function ChatHeader({ avatar, name, status }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center gap-3">
        <UserAvatar src={avatar} fallback={name}  />
        <div>
          <h2 className="font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground">{status}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-accent rounded-full transition-colors">
          <Phone className="w-5 h-5" />
        </button>
         <Button variant={"ghost"} size={"icon"}>
          <Video className="w-5 h-5" />
        </Button>

        <UserActionDropdown
          trigger={
            <Button variant={"ghost"} size={"icon"}>
              <MoreVertical className="w-5 h-5" />
            </Button>
          }
          items={chatRightSideMenuItems}
        />
      </div>
    </div>
  );
}
