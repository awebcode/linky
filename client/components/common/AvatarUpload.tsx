// components/common/AvatarUpload.tsx

import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { X } from "lucide-react"; // Optional: to use an icon for removing the image
import { z } from "zod";
import UserAvatar from "./UserAvatar";
import { toast } from "@/hooks/use-toast";

// Zod validation schema
const avatarValidationSchema = z.object({
  file: z
    .instanceof(File, { message: "File must be an instance of File" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image",
    }),
});

interface AvatarUploadProps {
  onChange: (file: File | null) => void;
  errorMessage?: string;
}

const AvatarUpload = ({ onChange, errorMessage }: AvatarUploadProps) => {
  const [image, setImage] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": ["*"], // Accept all types of image files
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        // Validate using Zod
        try {
          avatarValidationSchema.parse({ file });
          onChange(file);
          setImage(URL.createObjectURL(file));
        } catch (e) {
          if (e instanceof z.ZodError) {
            toast({
              title: "Error Accepting Files",
              description: e.errors.map((e) => e.message).join("\n"),
            });
          }
        }
      }
    },
  });

  return (
    <div className="relative w-16 h-16 rounded-full border border-dashed border-primary overflow-hidden mx-auto mb-2">
      <div
        {...getRootProps()}
        className="flex justify-center items-center w-full h-full cursor-pointer"
      >
        {image ? (
          <UserAvatar src={image}  />
        ) : (
          <>
            {isDragActive ? (
              <p className="text-primary">Drop ...</p>
            ) : (
              <UserAvatar  fallback="Avatar"  />
            )}
          </>
        )}
        <input {...getInputProps()} />
      </div>
      {image && (
        <button
          onClick={() => {
            setImage(null);
            onChange(null);
          }}
          className="absolute top-1 right-1 bg-white text-red-500 p-1 rounded-full"
        >
          <X size={16} />
        </button>
      )}
      {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
    </div>
  );
};

export default AvatarUpload;
