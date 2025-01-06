import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component

interface SkeletonCardProps {
  length: number;
}

export function OnlineUserCardSkeleton({ length = 1 }: SkeletonCardProps) {
  return (
    <>
      <ScrollArea className="flex-1  gap-2 cursor-pointer">
        <div className="flex gap-3">
          {[...Array(length)].map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />{" "}
              {/* Skeleton for UserAvatar */}
              <Skeleton className="h-4 w-14 rounded-md" /> {/* Skeleton for user name */}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}
