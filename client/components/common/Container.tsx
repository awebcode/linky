import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  ...attributes
}) => {
  return (
    <div
      className={cn(`w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 `, className)}
      {...attributes}
    >
      {children}
    </div>
  );
};

export default Container;
