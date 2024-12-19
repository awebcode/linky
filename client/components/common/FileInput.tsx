import { UploadCloud } from "lucide-react";
import React from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { z } from "zod";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";

// Define your Zod schema for file validation
export const fileSchema = z.object({
  files: z
    .array(
      z.object({
        type: z.string(),
        size: z.number(),
      })
    )
    .refine(
      (files) =>
        files.every(
          (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
        ),
      {
        message: "All files must be images and smaller than 5MB.",
      }
    ),
});


interface FileInputProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Accept;
}

const FileInput: React.FC<FileInputProps> = ({ onDrop, accept }) => {
  const { getRootProps, getInputProps, isDragActive,acceptedFiles } = useDropzone({
    accept,
    onDrop: (acceptedFiles) => {
      // Validate files using Zod
      const filesData = acceptedFiles.map((file) => ({
        type: file.type,
        size: file.size,
      }));

      try {
        fileSchema.parse({ files: filesData });
        onDrop(acceptedFiles);
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast({
            title: "Error Accepting Files",
            description: error.errors.map((e) => e.message).join("\n"),
          });
        } else {
          toast({
            title: "Error Accepting Files",
            description: "An unexpected error occurred.",
          })
        }
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg p-4 cursor-pointer focus:outline-none ${
        isDragActive ? "border-blue-500" : "border-primary"
      }`}
    >
      <Input {...getInputProps()} />
      <UploadCloud className="text-2xl md:text-6xl text-primary mb-4" />
      {isDragActive ? (
        <p className="!text-blue-500 font-semibold animate-pulse">
          Drop the files here...
        </p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )}
      {acceptedFiles.length > 0 && (
        <div className="mt-4">
          <p>Selected Files:</p>
          <ul className="list-disc pl-4 flex flex-col">
            {acceptedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileInput;
