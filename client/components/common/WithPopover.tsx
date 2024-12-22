import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  PopoverArrow,
  PopoverClose,
  type PopoverContentProps,
} from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

// Assuming PopoverContentProps is a valid type available in your code base
// We use Pick to choose the properties that we need from the full PopoverContentProps
interface WithPopoverProps
  extends Pick<PopoverContentProps, "side" | "sideOffset" | "align"> {
  children: React.ReactNode; // Content inside the Popover
  trigger: React.ReactNode; // The element that triggers the popover
  className?: string; // Additional class names for PopoverContent
  closeButton?: boolean; // Whether to show the close button
}

export const WithPopover: React.FC<WithPopoverProps> = ({
  trigger,
  children,
  className,
  closeButton = true,
  ...popoverProps
}) => {
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent
        side={popoverProps.side}
        sideOffset={popoverProps.sideOffset}
        align={popoverProps.align}
        className={cn("max-w-fit m-2", className)}
      >
        {children}
        {closeButton && <PopoverClose />}
        <PopoverArrow width={14} height={7} />
      </PopoverContent>
    </Popover>
  );
};
