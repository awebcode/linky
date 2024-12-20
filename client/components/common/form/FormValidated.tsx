"use client";
import React from "react";
import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "./TextInput";
import PendingButton from "../PendingButton";
import type { TextInputProps } from "@/types/index.types";
import FileInput from "./FileInput";
import type { AxiosError } from "axios";

type ZodHookFormProps = {
  schema: ZodSchema;
  onSubmit: (data: FieldValues) => void;
  fields: TextInputProps[];
  submitButtonLabel?: string;
  isFileUpload?: boolean;
  onAcceptFiles?: (file: File[]) => void;
  isPending: boolean;
  error: AxiosError & { response?: { data?: { message?: string } } };
};

const FormValidated = ({
  schema,
  onSubmit,
  fields,
  submitButtonLabel = "Submit",
  isFileUpload = false,
  onAcceptFiles,
  isPending,
  error,
}: ZodHookFormProps) => {
  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });

  return (
    <FormProvider {...methods}>
      {error && <p className="text-red-500">{error.response?.data?.message}</p>}

      <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full max-w-lg">
        {fields.map((field) =>
          field.component ? (
            <field.component key={field.name} {...field} />
          ) : (
            <TextInput key={field.name} {...field} />
          )
        )}

        {isFileUpload && (
          <FileInput
            onDrop={(files) => onAcceptFiles && onAcceptFiles(files)}
            accept={{ "image/*": [] }}
          />
        )}

        <PendingButton type="submit" className="w-full" isPending={isPending}>
          {submitButtonLabel}
        </PendingButton>
      </form>
    </FormProvider>
  );
};

export default FormValidated;
