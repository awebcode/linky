"use client";

import { z } from "zod";
import TextInput from "@/components/common/form/TextInput";
import Heading from "@/components/common/Heading";
import PendingButton from "@/components/common/PendingButton";
import FormWrapper from "@/components/common/form/FormWrapper";
import useResetPasswordMutation from "./reset-pass.mutation";
import FormLayout from "@/components/common/form/FormLayout";
import UserLink from "@/components/common/UserLink";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordProps {
  token: string; // Token received from the URL
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token }) => {
  const resetPasswordMutation = useResetPasswordMutation();

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate({
      ...data,
      token,
    });
  };
  
  

  return (
    <FormLayout >
      <Heading title="Reset Password" desc="Enter a new password to reset your account" />
      <FormWrapper
        error={resetPasswordMutation?.error}
        schema={resetPasswordSchema}
        onSubmit={onSubmit}
      >
        <TextInput
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="Enter your new password"
        />
        <TextInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your new password"
        />
        <PendingButton isPending={resetPasswordMutation.isPending}>
          Reset Password
        </PendingButton>
        <UserLink
          title="Remembered your password?"
          hrefTitle="Sign in here"
          href="/?tab=login"
        />
      </FormWrapper>
    </FormLayout>
  );
};

export default ResetPassword;
