import React from "react";
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
  asChild?:boolean
}

export const WithDropdown: React.FC<WithDropdownProps> = ({
  trigger,
  children,
  className = "w-48",
  align = "center",
  side = "bottom",
  sideOffset = 5,
  asChild=true
}) => {
  return (
    <DropdownMenu>
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
          {children}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
