import type { AxiosMethod, TextInputProps } from "@/types/index.types";
import {
  loginSchema,
  registerSchema,
  type SchemaType,
} from "@/types/schemas/index.schemas";
interface FormConfig {
  method: AxiosMethod;
  endpoint: string; // API endpoint
  successMessage: string; // Success message to display
  successMessageDescription?: string;
  errorMessage?: string;
  redirectPath: string; // Path to navigate on success
  schema: SchemaType; // Zod schema for validation
  fields: TextInputProps[]; // Array of form input configurations
}

export const formConfigs: Record<string, FormConfig> = {
  login: {
    method: "post",
    endpoint: "/auth/login",
    successMessage: "Login successful",
    successMessageDescription: "You are now logged in",
    errorMessage: "Login failed",
    redirectPath: "/chat",
    schema: loginSchema,
    fields: [
      { name: "email", label: "Email", type: "email", description: "Enter your email" },
      {
        name: "password",
        label: "Password",
        type: "password",
        description: "Enter your password",
      },
    ],
  },
  register: {
    method: "post",
    endpoint: "/auth/register",
    successMessage: "Registration successful",
    successMessageDescription: "You are now registered",
    errorMessage: "Registration failed",
    redirectPath: "/?tab=login",
    schema: registerSchema,
    fields: [
      { name: "name", label: "Name", type: "text", description: "Enter your full name" },
      { name: "email", label: "Email", type: "email", description: "Enter your email" },
      {
        name: "password",
        label: "Password",
        type: "password",
        description: "Create a strong password",
      },
    ],
  },
};
