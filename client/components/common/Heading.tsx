import { cn } from "@/lib/utils";
import React from "react";
interface HeadingProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  title: string;
  desc: string;
}
const Heading = ({ title, desc, className, ...props }: HeadingProps) => {
  return (
    <div className={cn("w-full primary p-4 rounded-t-lg", className)} {...props}>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-sm">{desc}</p>
    </div>
  );
};

export default Heading;
