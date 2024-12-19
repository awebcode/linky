import { z } from "zod";

// Base schema for common chat properties
const ChatBaseSchema = z.object({
  name: z.string().min(1, "Chat name is required"), // Common field for chat name
  chatId: z.string().uuid("Invalid chat ID"), // Chat ID (optional in the base schema)
  id: z.string().uuid("Invalid user ID"), // User ID (optional in the base schema)
});

// Schema for creating a chat
export const CreateChatSchema = ChatBaseSchema.pick({
  name: true,
});

// Schema for adding a user to a chat
export const AddUserToChatSchema = ChatBaseSchema.pick({
  chatId: true,
  id: true,
});

// Schema for updating a chat (partial schema for optional fields)
export const UpdateChatSchema = ChatBaseSchema.partial({
  name: true,
  chatId: true,
});

// Infer DTO types from schemas
export type CreateChatDTO = z.infer<typeof CreateChatSchema>;
export type AddUserToChatDTO = z.infer<typeof AddUserToChatSchema>;
export type UpdateChatDTO = z.infer<typeof UpdateChatSchema>;
