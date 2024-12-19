import { cn } from "@/lib/utils";
import React from "react";
interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
const Wrapper: React.FC<WrapperProps> = ({ children, className = "", ...props }) => {
  return (
    <section
      className={cn(
        `py-8  md:py-16 min-h-screen flex justify-center items-center`,
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};

export default Wrapper;
