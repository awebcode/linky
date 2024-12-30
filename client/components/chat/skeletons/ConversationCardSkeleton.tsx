import { Skeleton } from "@/components/ui/skeleton";

export function ConversationCardSkeleton() {
  return (
    <div className="p-2 hover:bg-accent rounded-lg cursor-pointer transition-colors">
      <div className="flex items-center gap-3">
        {/* Avatar Skeleton */}
        <Skeleton className="w-10 h-10 rounded-full" />

        <div className="flex-1 min-w-0">
          {/* Top row: name and timestamp */}
          <div className="flex items-center justify-between">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-16 h-3" />
          </div>

          {/* Bottom row: message and unread count */}
          <div className="flex items-center justify-between mt-2">
            <Skeleton className="w-40 h-3" />
            <Skeleton className="w-6 h-4 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
