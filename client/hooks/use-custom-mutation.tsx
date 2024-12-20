import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type MutationFn<TData, TVariables> = (variables: TVariables) => Promise<TData>;

function useCustomMutationHook<TData, TVariables>(
  mutationFn: MutationFn<TData, TVariables>,
  options?: UseMutationOptions<TData, unknown, TVariables>,
  redirectPath?: string
) {
  const router = useRouter();

  return useMutation<TData, unknown, TVariables>({
    mutationFn,
    ...options,
    onError: (error: any) => {
      // Conditionally render error toast if no custom error handler is provided
      if (!options?.onError) {
        toast({
          title: error?.response?.data?.message || "Operation failed",
          description: error?.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      }
      options?.onError?.(error, error, null); // Call custom error handler if provided
    },
    onSuccess: (data: any) => {
      // Conditionally render success toast if no custom success handler is provided
      if (!options?.onSuccess) {
        toast({
          title: data?.message || "Operation successful",
          description: data?.message || "Operation successful",
        });
      }
      if (redirectPath) {
        router.push(redirectPath); // Redirect if path is provided
      }
      options?.onSuccess?.(data, data, null); // Call custom success handler if provided
    },
  });
}

export default useCustomMutationHook;
