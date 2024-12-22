import React from "react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";

interface WithContextMenuProps  {
  trigger: React.ReactNode; // The trigger element for the context menu
  children: React.ReactNode; // Content of the context menu
  className?: string; // Optional className for styling
  side?: "top" | "bottom" | "left" | "right"; // Position of the context menu
  align?: "start" | "center" | "end"; // Alignment of the context menu
  sideOffset?: number; // Offset for positioning
}

export const WithContextMenu: React.FC<WithContextMenuProps> = ({
  trigger,
  children,
  className = "w-64",
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{trigger}</ContextMenuTrigger>
      <ContextMenuContent
        className={cn(className)}
      >
        {children}
      </ContextMenuContent>
    </ContextMenu>
  );
};
