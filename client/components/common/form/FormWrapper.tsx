import { ZodType } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

interface FormWrapperProps<T> {
  schema: ZodType<T>;
  onSubmit: (data: T) => void;
  error: AxiosError<{ message: string }> | unknown;
  children: React.ReactNode;
}

const FormWrapper = <T extends Record<string, unknown>>({
  schema,
  onSubmit,
  error,
  children,
}: FormWrapperProps<T>) => {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    mode: "all",
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="">
        {error instanceof AxiosError && (
          <p className="text-red-500">{error.response?.data?.message}</p>
        )}
        {children}
      </form>
    </FormProvider>
  );
};

export default FormWrapper;
