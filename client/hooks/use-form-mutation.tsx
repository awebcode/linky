import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";
import { toast } from "@/hooks/use-toast";
import type { FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import type { AxiosMethod } from "@/types/index.types";
type UseFormMutationParams = {
    method:AxiosMethod
  endpoint: string; // API endpoint
  successMessage?: string;
  successMessageDescription?: string;
  errorMessage?: string;
  redirectPath?: string; // Where to navigate after success
  onSuccess?: (data: any) => void; // Custom onSuccess handler
  onError?: (error: any) => void; // Custom onError handler
};

export const useFormMutation = ({
  method="post",
  endpoint,
  successMessage = "Operation successful",
  successMessageDescription = "Operation successful",
  errorMessage = "Operation failed",
  redirectPath,
  onSuccess,
  onError,
}: UseFormMutationParams) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: FieldValues) => {
      const response = await axiosInstance[method](endpoint, data)
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title:data?.message || successMessage,
        description: successMessageDescription || successMessage,
      });
      if (redirectPath) {
        router.push(redirectPath);
      }
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: any) => {
      toast({
        title: errorMessage || "Operation failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      if (onError) {
        onError(error);
      }
    },
  });
};
