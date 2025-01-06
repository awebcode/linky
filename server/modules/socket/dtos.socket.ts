import { Status } from "@prisma/client";
import { z } from "zod";

// Main schema for creating a socket message
const FileSchema = z.object({
    secure_url: z.string().url(),
})
export const CreateSocketMessageSchema = z.object({
  content: z.string(), // The main content content
  chatId: z.string(), // Chat ID associated with the message
  tempId: z.string(),
  sender: z.object({
    id: z.string(),
    name: z.string(),
    image: z
      .union([z.string().url(), z.literal("")])
      .optional()
      .nullable(), // Allow empty string, URL, or null
    status: z.nativeEnum(Status).optional(), // Sender's status
  }),
  files: z.array(FileSchema).optional(), // Optional files array
});