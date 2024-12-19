import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { FormDescription } from "@/components/ui/form";

interface SelectInputProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  description?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  description,
  options,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="py-4">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="min-w-[180px] w-full">
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      <FormDescription>{description}</FormDescription>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className="!text-red-500 text-xs mt-2">{message}</p>}
      />
    </div>
  );
};
