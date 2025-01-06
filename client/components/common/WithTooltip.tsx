import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TooltipContentProps, TooltipProviderProps } from "@radix-ui/react-tooltip";

interface WithTooltipProps
  extends Pick<TooltipContentProps, "side" | "sideOffset" | "className">,
    Pick<TooltipProviderProps, "delayDuration" | "skipDelayDuration"> {
  text?: string; // Tooltip text
  children: React.ReactNode; // Child element to wrap
  content?: React.ReactNode;
}

export const WithTooltip: React.FC<WithTooltipProps> = ({
  text,
  children,
  content,
  side = "top", // Default to "top"
  sideOffset = 10,
  delayDuration = 300, // Default delay
  skipDelayDuration = 100, // Default skip delay
  className,
}) => {
  return (
    <TooltipProvider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} sideOffset={sideOffset} className={className}>
          {text && <p>{text}</p>}
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
