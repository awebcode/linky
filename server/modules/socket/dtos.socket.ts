import { MessageStatus, Status } from "@prisma/client";
import { z } from "zod";
export const uuidV7Regex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// Main schema for creating a socket message
const FileSchema = z.object({
    secure_url: z.string().url(),
})

export const CreateSocketMessageSchema = z.object({
  content: z.string(), // The main content content
  chatId: z.string(), // Chat ID associated with the message
  id: z.string(), // Unique ID for the message
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