import type { z } from "zod";
import  { CreateSocketMessageSchema } from "./dtos.socket";
import prisma from "../../libs/prisma";
import { AppError } from "../../middlewares/errors-handle.middleware";

/**
 * @description Create Message For Socket
 * @param data - The data to create a message
 */
export const createMessageForSocket = async (
  data: z.infer<typeof CreateSocketMessageSchema>
) => {
  const { content,tempId, chatId, sender, files } = CreateSocketMessageSchema.parse(data);

  try {
    const messageData: any = {
      tempId,
      content,
      senderId: sender.id,
      chatId,
    };

    if (files?.length) {
      messageData.media = {
        createMany: {
          data: files.map((file) => ({ url: file.secure_url })),
        },
      };
    }

    const message = await prisma.message.create({ data: messageData, select: {id: true} });
    return message;
  } catch (error) {
    console.log({ error });
    throw new AppError("Error creating message", 500);
  }
};
