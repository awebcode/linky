// components/ui/avatar.tsx

import { cn } from "@/lib/utils"; // Import cn utility
import {
  Avatar ,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface AvatarProps  {
  src?: string | null;
  fallback?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const UserAvatar = ({ src, fallback = "User", className, size = "md" }: AvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <Avatar className={cn("rounded-full border", sizeClasses[size], className)}>
      {src ? (
        <AvatarImage src={src} alt={fallback} />
      ) : (
        <AvatarFallback>{fallback}</AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
