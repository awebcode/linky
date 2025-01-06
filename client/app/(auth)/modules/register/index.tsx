"use client";

import { z } from "zod";
import TextInput from "@/components/common/form/TextInput";
import Heading from "@/components/common/Heading";
import PendingButton from "@/components/common/PendingButton";
import FormWrapper from "@/components/common/form/FormWrapper";
import SocialButtons from "@/components/common/SocialButtons";
import useRegisterMutation from "./register.mutation";
import AvatarUpload from "@/components/common/AvatarUpload";
import { useState } from "react";
import FormLayout from "@/components/common/form/FormLayout";
import UserLink from "@/components/common/UserLink";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatar: z.instanceof(File).optional(), // Avatar is optional
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const registerMutation = useRegisterMutation();
  const [avatar, setAvatar] = useState<File | null>(null);

  const onSubmit = (data: RegisterFormValues) => {
    // Prepare form data for submission
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (avatar) formData.append("avatar", avatar); // Append avatar if it exists

    registerMutation.mutate(formData); // Pass form data to mutation
  };

  return (
    <FormLayout className="min-h-max">
      <Heading title="Register" desc="Create a new account" />
      <FormWrapper
        error={registerMutation?.error}
        schema={registerSchema}
        onSubmit={onSubmit}
      >
        {/* Avatar Upload */}
        <AvatarUpload onChange={(file) => setAvatar(file)} />

        <TextInput name="name" label="Name" placeholder="Enter your name" />
        <TextInput name="email" label="Email" placeholder="Enter your email" />
        <TextInput
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
        />
        <PendingButton isPending={registerMutation.isPending}>Register</PendingButton>
        <UserLink
          title="Already have an account?"
          hrefTitle="Sign in here"
          href="/?tab=login"
        />
        <SocialButtons />
      </FormWrapper>
    </FormLayout>
  );
};

export default Register;
