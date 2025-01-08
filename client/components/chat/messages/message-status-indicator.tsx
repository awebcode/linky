import { MessageStatus } from "@prisma/client";
import { Check, CheckCircle, Eye, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

// Configuration for message statuses
const STATUS_CONFIG: Record<
  MessageStatus,
  { icons: { icon: React.ElementType; color: string }[]; label: string }
> = {
  PENDING: {
    icons: [{ icon: Loader, color: "text-blue-500" }],
    label: "Sending...",
  },
  SENT: {
    icons: [{ icon: Check, color: "text-gray-500" }],
    label: "Sent",
  },
  DELIVERED: {
    icons: [
      { icon: Check, color: "text-yellow-500" },
      { icon: CheckCircle, color: "text-blue-500" },
    ],
    label: "Delivered",
  },
  READ: {
    icons: [
      { icon: Check, color: "text-yellow-500" },
      { icon: Eye, color: "text-green-500" },
    ],
    label: "Seen",
  },
};

interface MessageStatusIndicatorProps {
  status: MessageStatus;
}

const MessageStatusIndicator = ({ status }: MessageStatusIndicatorProps) => {
  const config = STATUS_CONFIG[status];

  if (!config) return null; // Handle unsupported status

  return (
    <div className="flex items-center gap-1 text-sm">
      {/* Icons */}
      <div className="flex items-center gap-0.5">
        {config.icons.map(({ icon: Icon, color }, index) => (
          <Icon key={index} className={cn("w-3 h-3", color)} />
        ))}
      </div>

      {/* Label */}
      <span className={cn("capitalize text-xs", config.icons[0]?.color)}>
        {config.label}
      </span>
    </div>
  );
};

export default MessageStatusIndicator;
