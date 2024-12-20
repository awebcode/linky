import type { AxiosMethod, TextInputProps } from "@/types/index.types";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  type SchemaType,
} from "@/types/schemas/index.schemas";
interface FormConfig {
  method: AxiosMethod;
  endpoint: string; // API endpoint
  btnText: string;
  successMessage: string; // Success message to display
  successMessageDescription?: string;
  errorMessage?: string;
  redirectPath: string; // Path to navigate on success
  schema: SchemaType; // Zod schema for validation
  fields: TextInputProps[]; // Array of form input configurations
}

export const formConfigs: Record<string, FormConfig> = {
  
  forgot: {
    method: "post",
    endpoint: "/auth/forgot-password",
    btnText: "Send Reset Link",
    successMessage: "Password reset link sent",
    successMessageDescription: "Please check your email",
    errorMessage: "Password reset failed",
    redirectPath: "/?tab=login",
    schema: forgotPasswordSchema,
    fields: [
      { name: "email", label: "Email", type: "email", description: "Enter your email" },
    ],
  },
};
