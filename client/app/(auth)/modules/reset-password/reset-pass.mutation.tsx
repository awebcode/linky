import axiosInstance from "@/config/axiosInstance";
import useCustomMutationHook from "@/hooks/use-custom-mutation";
import { toast } from "@/hooks/use-toast";

const useResetPasswordMutation = (redirectPath?: string) =>
  useCustomMutationHook(
    async (credentials: { token: string; newPassword: string }) => {
      const response = await axiosInstance.post("/auth/reset-password", credentials);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast({
          title: data?.message || "Password reset successful",
          description: "You can now login with your new password",
        });
      },
    },

    redirectPath
  );

export default useResetPasswordMutation;
