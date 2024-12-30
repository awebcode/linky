import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import type { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export interface WithDropdownProps
  extends Pick<DropdownMenuContentProps, "className" | "align" | "side" | "sideOffset"> {
  trigger: React.ReactNode; // The trigger element for the dropdown
  children: React.ReactNode; // Content of the dropdown
  asChild?: boolean;
  open?: boolean; // Controlled open state
  onOpenChange?: (open: boolean) => void; // Controlled open state change handler
}

export const WithDropdown: React.FC<WithDropdownProps> = ({
  trigger,
  children,
  className = "w-48",
  align = "center",
  side = "bottom",
  sideOffset = 5,
  asChild = true,
  open: controlledOpen,
  onOpenChange,
}) => {
  // Local state for managing dropdown open state when not controlled
  const [isOpen, setIsOpen] = useState(controlledOpen ?? false);

  // Sync the controlled state with internal state
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsOpen(controlledOpen);
    }
  }, [controlledOpen]);

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open); // Call external handler if provided
    } else {
      setIsOpen(open); // Otherwise, manage internally
    }
  };

  const closeDropdown = () => {
    handleOpenChange(false); // Close the dropdown programmatically
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild={asChild}>{trigger}</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          className={cn("max-w-fit mx-1", className, {
            "mx-2": side === "top" || side === "bottom",
          })}
          align={align}
          side={side}
          sideOffset={sideOffset}
        >
          {/* Pass closeDropdown to children if they need to close the dropdown */}
          {children}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
