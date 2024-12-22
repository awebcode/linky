import React from "react";
import { WithDropdown, type WithDropdownProps } from "@/components/common/WithDropdown";
import { cn } from "@/lib/utils";
import type { UserActionDropdownItem } from "@/types/chat";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface UserActionDropdownProps extends Omit<WithDropdownProps, "children"> {
  items: UserActionDropdownItem[];
  itemClassName?: string;
}

const UserActionDropdown: React.FC<UserActionDropdownProps> = ({
  items,
  trigger,
  itemClassName,
  ...props
}) => {
  return (
    <WithDropdown trigger={trigger} {...props}>
      <div className="flex flex-col gap-1">
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            className={cn("flex justify-start gap-2", itemClassName)}
            onClick={item.action}
          >
            {item?.icon && <item.icon className="w-4 h-4" />}
            <span>{item.text}</span>
          </DropdownMenuItem>
        ))}
      </div>
    </WithDropdown>
  );
};

export default UserActionDropdown;
