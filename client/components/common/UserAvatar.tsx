"use client"
// components/ui/avatar.tsx

import { cn } from "@/lib/utils"; // Import cn utility
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Status } from "@prisma/client";
interface AvatarProps {
  user?: { name: string; image: string,status:Status }; // User data with name and image
  src?: string | null; // Optional external image source (overrides user image)
  fallback?: string; // Fallback name or text
  className?: string; // Optional className for styling
  size?: "sm" | "md" | "lg"; // Avatar size
  isOnline?:boolean
  showOnlineIndicator?: boolean;
}

const UserAvatar = ({
  user,
  src="/images/avatar.jpg",
  fallback = "User",
  className,
  size = "md",
  isOnline,
  showOnlineIndicator = true
}: AvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  };

  const displayName = user?.name || fallback;
  const displayImage = user?.image || src;
  const isUserOnline=user?.status===Status.ONLINE||isOnline
  return (
    <div className="relative">
      <Avatar className={cn("rounded-full border", sizeClasses[size], className)}>
        {displayImage ? (
          <AvatarImage src={displayImage} alt={displayName} />
        ) : (
          <AvatarFallback className="bg-gray-300 dark:bg-slate-700">{displayName.slice(0, 2)}</AvatarFallback>
        )}
      </Avatar>

      {showOnlineIndicator  && (
        <span
          className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
            isUserOnline ? "bg-green-500" : "bg-muted"
          )}
        />
      )}
    </div>
  );
};

export default UserAvatar;
