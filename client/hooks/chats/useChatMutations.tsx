import type { CreateChatInput } from "@/types/chat";
import useCustomMutationHook from "../use-custom-mutation";
import axiosInstance from "@/config/axiosInstance";
import { toast } from "../use-toast";
import { useQueryClient } from "@tanstack/react-query";

// Function to send a message and handle success/error
export const useCreateChatMutation = (redirectPath?: string) => {
    const queryClient = useQueryClient();
  return useCustomMutationHook(
    async (data: CreateChatInput) => {
      const response = await axiosInstance.post("/chat/create-chat", data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["chats"] });
        console.log("Chat created successfully");
        toast({
          title: "Chat created successfully",
          description: "You have successfully created a chat",
        });
      },
      onError: (error) => {
        console.error("Error sending message:", error);
        toast({
          title: "Error creating chat",
          description: "Something went wrong while creating the chat",
          variant: "destructive",
        });
      },
    },
    redirectPath
  );
};
