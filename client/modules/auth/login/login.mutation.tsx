import useCustomMutationHook from "@/hooks/use-custom-mutation";
import { toast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

const useLoginMutation = (redirectPath?: string) =>
  useCustomMutationHook(
    async (credentials: { email: string; password: string }) => {
      const response = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });
      if (!response?.ok) {
        throw new Error(response?.error || "Login failed");
      }
      return response;
    },
    {
      onSuccess: () => {
        // Custom logic after successful login
        toast({
          title: "Login successful",
          description: "You have successfully logged in",
        });
      },
      
    },

    redirectPath
  );

export default useLoginMutation;
