import { useDynamicForm } from "@/hooks/use-dyanamic-form";
import FormValidated from "./FormValidated";
import type { formConfigs } from "@/config/form.config";

const DynamicForm = ({ formType }: { formType: keyof typeof formConfigs }) => {
  const { mutate, error, isPending, fields, schema } = useDynamicForm(formType);

  return (
    <FormValidated
      schema={schema}
      fields={fields}
      onSubmit={mutate}
      error={error}
      isPending={isPending}
      submitButtonLabel={formType === "login" ? "Login" : "Register"}
    />
  );
};

export default DynamicForm;
