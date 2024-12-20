import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { FormDescription, FormItem, FormLabel } from "@/components/ui/form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "../../ui/button";
import type { TextInputProps } from "@/types/index.types";

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  autoComplete,
  description,
  type = "text",
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext(); // Access form context

  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  return (
    <FormItem className="mb-4">
      <FormLabel className={`${errors[name] ? "text-red-500" : ""}`} htmlFor={name}>
        {label}
      </FormLabel>
      <div className="relative">
        <Input
          placeholder={"Please Enter " + label}
          id={name}
          type={type === "password" && !showPassword ? "password" : "text"} // Toggle input type
          {...register(name)} // Register the input field with React Hook Form
          className={` ${errors[name] ? "border-red-500" : ""}`}
          autoComplete={autoComplete || "on"}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2  transition-all"
          >
            {showPassword ? (
              <EyeIcon className="text-gray-400 h-5 w-5" />
            ) : (
              <EyeOffIcon className="text-gray-500 h-5 w-5" />
            )}
          </button>
        )}
      </div>

      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className="!text-red-500 text-xs ">{message}</p>}
      />
    </FormItem>
  );
};

export default TextInput;
