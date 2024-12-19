import { formConfigs } from "@/config/form.config";
import { useFormMutation } from "./use-form-mutation";

export const useDynamicForm = (formType: keyof typeof formConfigs) => {
  const config = formConfigs[formType];
  return {
    ...useFormMutation(config), // Returns mutation logic
    fields: config.fields, // Returns fields for the form
    schema: config.schema,
  };
};
