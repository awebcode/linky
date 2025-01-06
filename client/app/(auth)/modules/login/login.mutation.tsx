import useCustomMutationHook from "@/hooks/use-custom-mutation";
import { toast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { loginUser } from "./login.actions";

const useLoginMutation = (redirectPath?: string) =>
  useCustomMutationHook(
    async (credentials: { email: string; password: string }) => {
      return await loginUser(credentials.email, credentials.password);
    },
    {
      onSuccess: () => {
        // Custom logic after successful login
        toast({
          title: "Login successful",
          description: "You have successfully logged in",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Login failed",
          description: error?.message,
          variant: "destructive",
        });
      },
    },

    redirectPath
  );

export default useLoginMutation;
