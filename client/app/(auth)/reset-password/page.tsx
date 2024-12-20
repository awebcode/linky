import ResetPassword from "@/modules/auth/reset-password";
import { notFound } from "next/navigation";
import React from "react";

interface ResetProps {
  searchParams: Promise<{ token: string }>;
}
const Reset: React.FC<ResetProps> = async ({ searchParams }) => {
  const { token } = await searchParams;
  if (!token) return notFound();
  return (
    <>
      <ResetPassword token={token} />
    </>
  );
};

export default Reset;
