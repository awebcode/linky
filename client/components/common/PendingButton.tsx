import React from "react";
import { Button, type ButtonProps } from "../ui/button";
import { useFormStatus } from "react-dom";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props extends ButtonProps {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
  isPending?: boolean;
}

const PendingButton = ({ className, pendingText, isPending, ...props }: Props) => {
  const { pending } = useFormStatus();
  const IsPending = pending || isPending; // Combine with form status pending

  // Filter out 'isPending' and any other unnecessary props
  const buttonProps = { ...props };

  return (
    <Button disabled={IsPending} className={cn("w-full", className)} {...buttonProps}>
      {IsPending ? (
        <>
          <Loader className="mr-2 h-6 w-6 animate-spin" /> {pendingText}
        </>
      ) : (
        props.children
      )}
    </Button>
  );
};

export default PendingButton;
