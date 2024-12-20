"use client";

import { z } from "zod";
import TextInput from "@/components/common/form/TextInput";
import Heading from "@/components/common/Heading";
import PendingButton from "@/components/common/PendingButton";
import FormWrapper from "@/components/common/form/FormWrapper";
import SocialButtons from "@/components/common/SocialButtons";
import useLoginMutation from "./login.mutation";
import FormLayout from "@/components/common/form/FormLayout";
import UserLink from "@/components/common/UserLink";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const loginMutation = useLoginMutation();

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <FormLayout className="min-h-max">
      <Heading title="Sign In" desc="Enter your credentials to sign in" />
      <FormWrapper error={loginMutation?.error} schema={loginSchema} onSubmit={onSubmit}>
        <SocialButtons />
        <TextInput name="email" label="Email" placeholder="Enter your email" />
        <TextInput
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
        />
        <PendingButton isPending={loginMutation.isPending}>Sign In</PendingButton>
        <UserLink
          title="Forgot your password?"
          hrefTitle="Reset it here"
          href="/forgot-password"
        />
      </FormWrapper>
    </FormLayout>
  );
};

export default Login;
