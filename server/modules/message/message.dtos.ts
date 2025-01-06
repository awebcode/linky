import { Status } from "@prisma/client";
import { z } from "zod";

// Schema for creating a new message
export const CreateMessageSchema = z.object({
  content: z.string().min(1, "Message content cannot be empty"),
  senderId: z.string(),
  chatId: z.string(),
});




// Schema for fetching messages by chatId
export const GetMessagesSchema = z.object({
  chatId: z.string(),
  cursor: z.string().optional(), // Optional string for cursor (for pagination)
  take: z
    .string() // Accept `take` as a string
    .optional()
    .refine((value) => value === undefined || !isNaN(Number(value)), {
      message: "Take must be a number",
    }) // Check if it can be converted to a number
    .transform((value) => (value !== undefined ? Number(value) : 10)) // Convert to number, default to 10
    .refine((value) => value >= 1 && value <= 100, {
      message: "Take must be between 1 and 100",
    }), // Validate range after conversion
});

// Schema for marking a message as seen
export const MarkMessageAsSeenSchema = z.object({
  messageId: z.string().uuid("Invalid message ID format"),
  userId: z.string().uuid("Invalid user ID format"),
});
