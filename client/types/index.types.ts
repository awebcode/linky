import React from "react";

export type Theme = "light" | "dark";
export type AxiosMethod = "post" | "put" | "delete" | "patch";

// Define a type for components and their props
interface ComponentTypes<TProps = any> {
  component?: React.FC<TProps>; // The component type, generic to support any props
  componentProps?: TProps; // Props to pass to the component
}

// Extend InputProps to include component and props information
export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    ComponentTypes<TextInputProps> {
  label: string;
  name: string;
  type?: string;
  description?: string;
}

// Define a file with preview structure
export interface FileWithPreview {
  file: File;
  preview: string;
}

// Generic className type for styling
export type ClassName = React.HTMLAttributes<HTMLElement>["className"];
