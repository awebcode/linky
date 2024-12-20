import axiosInstance from "@/config/axiosInstance";
import useCustomMutationHook from "@/hooks/use-custom-mutation";

const useRegisterMutation = (redirectPath?: string) =>
  useCustomMutationHook(
    async (credentials: FormData) => {
      const response = await axiosInstance.post("/auth/register", credentials, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        // Custom logic after successful login
        console.log("Registration successful");
      },
    },

    redirectPath
  );

export default useRegisterMutation
