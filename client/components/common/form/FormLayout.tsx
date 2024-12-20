"use client";

import { cn } from "@/lib/utils";
import type React from "react";

interface FormLayout extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;

}
const FormLayout: React.FC<FormLayout> = ({children,className, ...props}) => {
  return (
    <div className={cn("min-h-screen flex flex-col justify-center items-center", className)} {...props}>
      <div className="w-full max-w-lg space-y-2 bg-neutral-200/10 p-2 md:p-4 rounded-lg shadow-2xl">
        {children}
      </div>
    </div>
  );
};

export default FormLayout;
