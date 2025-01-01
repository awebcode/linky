import { z } from "zod";

// Base schema for common chat properties
export const CreateChatSchema = z.object({
  name: z.string().min(1, "Chat name is required"), // Ensure chat name is not empty
  isGroupChat: z.boolean().optional(), // Whether the chat is a group chat or not
  members: z.array(z.string()).min(1, "At least one member is required"), // Members are optional, but if provided, they should be an array of strings
});

export const AddUserToChatSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  chatId: z.string().uuid("Invalid chat ID format"),
});

export const GetChatsQuerySchema = z.object({
  search: z.string().optional().default(""), // Default to an empty string if not provided
  cursor: z.string().optional(), // Optional string for cursor (for pagination)
  nextUnlistedCursor: z.string().optional(),
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
