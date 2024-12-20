"use client";

import { cn } from "@/lib/utils";
import Link, { type LinkProps } from "next/link";
import type React from "react";

interface UserLinkProps extends LinkProps {
  className?: string;
  title?: string;
  hrefTitle: string;
}

const UserLink: React.FC<UserLinkProps> = ({
  className,
  href,
  title,
  hrefTitle,
  ...props
}) => {
  return (
    <div className="text-base   flex items-center gap-2">
      {title && <h2 className="text-accent-foreground">{title}</h2>}
      <Link
        href={href}
        className={cn(
          "inline text-primary hover:text-accent-foreground  transition-all duration-200 ease-in-out",
          className
        )}
        {...props}
      >
        {hrefTitle && hrefTitle}
      </Link>
    </div>
  );
};

export default UserLink;
