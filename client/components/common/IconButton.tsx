import React from "react";
import { Button, type ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";
interface IconButtonProps extends ButtonProps {
  children: React.ReactNode;
}
const IconButton: React.FC<IconButtonProps> = ({ className, children, ...props }) => {
  return (
    <Button size={"icon"} variant={"ghost"} className={cn("p-2", className)} {...props}>
      {children}
    </Button>
  );
};

export default IconButton;
