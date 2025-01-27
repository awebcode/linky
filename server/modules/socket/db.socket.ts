import type { z } from "zod";
import  { CreateSocketMessageSchema } from "./dtos.socket";
import prisma from "../../libs/prisma";
import { AppError } from "../../middlewares/errors-handle.middleware";
import { loggerInstance } from "../../config/logger.config";

/**
 * @description Get GroupIds For User From DB
 * @param userId - The ID of the user to fetch groups for.
 * @returns {Promise<string[]>} - A promise that resolves to an array of group IDs.
 */
export const getGroupIdsForUserFromDB = async (userId: string) => {
  try {
    const groupIds = await prisma.chat.findMany({
      where: {isGroup: true, members: { some: { id: userId } } },
      select: { id: true },
    });
    return groupIds.map((group) => group.id);
  } catch (error) {
    loggerInstance.error("Error fetching group IDs", error);
    throw new AppError("Error fetching group IDs", 500);
  }
};

/**
 * @description Create Message For Socket
 * @param data - The data to create a message
 */
export const createMessageForSocket = async (
  data: z.infer<typeof CreateSocketMessageSchema>
) => {
  const {id, content, chatId, sender, files } = CreateSocketMessageSchema.parse(data);

  try {
    const messageData: any = {
      id,
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
    loggerInstance.error("Error creating message", error);
    throw new AppError("Error creating message", 500);
  }
};
