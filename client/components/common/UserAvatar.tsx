"use client"
// components/ui/avatar.tsx

import { cn } from "@/lib/utils"; // Import cn utility
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarProps {
  user?: { name: string; image: string }; // User data with name and image
  src?: string | null; // Optional external image source (overrides user image)
  fallback?: string; // Fallback name or text
  className?: string; // Optional className for styling
  size?: "sm" | "md" | "lg"; // Avatar size
  
}

const UserAvatar = ({
  user,
  src,
  fallback = "User",
  className,
  size = "md",
}: AvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  };

  const displayName = user?.name || fallback;
  const displayImage = user?.image || src;

  return (
    <Avatar   className={cn("rounded-full border", sizeClasses[size], className)}>
      {displayImage ? (
        <AvatarImage src={displayImage} alt={displayName} />
      ) : (
        <AvatarFallback>{displayName[0]}</AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
