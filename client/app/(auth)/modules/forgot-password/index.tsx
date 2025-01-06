"use client";

import DynamicForm from "@/components/common/form/DynamicForm";
import FormLayout from "@/components/common/form/FormLayout";
import Heading from "@/components/common/Heading";
import UserLink from "@/components/common/UserLink";

const ForgotPassword = () => {
  return (
    <FormLayout>
      <Heading
        title="Forgot Password"
        desc="Enter your email to receive a password reset link"
      />
      <DynamicForm formType="forgot" />
      <UserLink
        title="Remembered your password?"
        href="/?tab=login"
        hrefTitle="Sign In"
      />
    </FormLayout>
  );
};

export default ForgotPassword;
