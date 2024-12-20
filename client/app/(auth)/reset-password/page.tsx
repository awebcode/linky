import ResetPassword from "@/modules/auth/reset-password";
import { notFound } from "next/navigation";
import React from "react";
interface ResetProps {
  searchParams: {
    token: string;
  };
}
const Reset: React.FC<ResetProps> = ({ searchParams: { token } }) => {
    if(!token) return notFound()
  return (
    <>
      <ResetPassword token={token} />
    </>
  );
};

export default Reset;
