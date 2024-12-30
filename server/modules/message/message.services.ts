import type { Request } from "express";
import prisma from "../../libs/prisma";
import {
  CreateMessageSchema,
  GetMessagesSchema,
  MarkMessageAsSeenSchema,
} from "./message.dtos";
import { uploadMultipleFiles } from "../../config/cloudinary.config";

const createMessage = async (req: Request) => {

  const { content, chatId } = CreateMessageSchema.parse(req.body);
  const senderId = req.user.id;
  if (req.files && (req.files as Express.Multer.File[]).length) {
    const uploadedFiles = await uploadMultipleFiles(req);
    return await prisma.message.create({
      data: {
        content,
        senderId,
        chatId,
        media: {
          createMany: {
            data: uploadedFiles.map((file) => ({
              url: file.url,
              publicId: file.public_id,
            })),
          },
        },
      },
    });
  }
  return await prisma.message.create({
    data: {
      content,
      senderId,
      chatId,
    },
  });
};

const getMessages = async (req: Request) => {
  const { chatId } = GetMessagesSchema.parse(req.params);
  return await prisma.message.findMany({
    where: { chatId },
    include: { sender: true },
    orderBy: { sentAt: "asc" },
  });
};

const markMessageAsSeen = async (req: Request) => {
  const { messageId, userId } = MarkMessageAsSeenSchema.parse(req.body);
  return await prisma.messageSeen.create({
    data: {
      messageId,
      userId,
    },
  });
};

export { createMessage, getMessages, markMessageAsSeen };
