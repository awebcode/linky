import type { Request } from "express";
import prisma from "../../libs/prisma";
import {
  CreateMessageSchema,
  GetMessagesSchema,
  MarkMessageAsSeenSchema,
} from "./message.dtos";
import { uploadMultipleFiles } from "../../config/cloudinary.config";
import type { Message, Prisma } from "@prisma/client";

// Helper function to fetch reactions with next cursor support
async function getReactions(messageIds: string[], cursor?: string, limit: number = 10) {
  const reactions = await prisma.reaction.groupBy({
    by: ["messageId", "emoji"],
    where: { messageId: { in: messageIds } },
    _count: { emoji: true },
    orderBy: { _count: { emoji: "desc" } },
    skip: cursor ? 1 : 0,
    take: limit,
  });

  const nextCursor = reactions.length > limit ? reactions[limit - 1].messageId : null;

  return { reactions, nextCursor };
}

// Helper function to fetch seen users with next cursor support
async function getSeenUsers(messageIds: string[], cursor?: string, limit: number = 10) {
  const seenUsers = await prisma.messageSeen.findMany({
    where: { messageId: { in: messageIds } },
    select: {
      messageId: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          status: true,
        },
      },
      seenAt: true,
    },
    skip: cursor ? 1 : 0,
    take: limit,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { seenAt: "desc" },
  });

  const nextCursor = seenUsers.length > limit ? seenUsers[limit - 1].messageId : null;

  return { seenUsers, nextCursor };
}

// Helper function to get top emojis with total count and pagination support
async function getTopEmojisWithTotalCount(
  messageId: string,
  cursor?: string,
  limit: number = 4
) {
  const [reactions, totalCount] = await Promise.all([
    prisma.reaction.groupBy({
      by: ["emoji"],
      where: { messageId },
      _count: { emoji: true },
      orderBy: { _count: { emoji: "desc" } },
      take: limit,
      skip: cursor ? 1 : 0,
    }),
    prisma.reaction.count({ where: { messageId } }),
  ]);

  const nextCursor = reactions.length > limit ? reactions[limit - 1].emoji : null;

  return {
    totalCount,
    topEmojis: reactions.map((reaction) => ({
      emoji: reaction.emoji,
      count: reaction._count.emoji,
    })),
    nextCursor,
  };
}

// Main function to create a message
const createMessage = async (req: Request) => {
  const { content, chatId } = CreateMessageSchema.parse(req.body);
  const senderId = req.user.id;

  const createData: any = {
    content,
    senderId,
    chatId,
  };

  if (req.files && (req.files as Express.Multer.File[]).length) {
    const uploadedFiles = await uploadMultipleFiles(req);
    createData["media"] = {
      createMany: {
        data: uploadedFiles.map((file) => ({
          
          url: file.url,
          publicId: file.public_id,
        })),
      },
    };
  }

  return await prisma.message.create({ data: createData });
};

// Main function to get messages with reactions and seen users
const getMessages = async (req: Request) => {
  const { chatId, cursor, limit } = GetMessagesSchema.parse(req.params);

  const messages = await prisma.message.findMany({
    where: { chatId },
    select: {
      id: true,
      content: true,
      sentAt: true,
      status: true,
      sender: { select: { id: true, name: true, image: true } },
      media: { select: { id: true, type: true, url: true } },
    },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { sentAt: "desc" },
  });

  const messageIds = messages.map((message) => message.id);

  // Fetch reactions and seen users in parallel
  const [reactionData, seenUserData] = await Promise.all([
    getReactions(messageIds, cursor, limit),
    getSeenUsers(messageIds, cursor, limit),
  ]);

  const messageDetails = messages.map((message) => ({
    ...message,
    reactions: reactionData.reactions
      .filter((reaction) => reaction.messageId === message.id)
      .map((reaction) => ({
        emoji: reaction.emoji,
        count: reaction._count.emoji,
      })),
    seen: seenUserData.seenUsers
      .filter((seen) => seen.messageId === message.id)
      .map((seen) => ({
        user: seen.user,
        seenAt: seen.seenAt,
      })),
  }));

  return {
    messages: messageDetails,
    nextCursor: reactionData.nextCursor || seenUserData.nextCursor || null,
  };
};

// Function to get seen users with pagination
async function getSeenUsersWithPagination(
  messageId: string,
  cursor?: string,
  limit: number = 10
) {
  const { seenUsers, nextCursor } = await getSeenUsers([messageId], cursor, limit);
  return { seenUsers, nextCursor };
}

// Function to mark a message as seen
const markMessageAsSeen = async (req: Request) => {
  const { messageId, userId } = MarkMessageAsSeenSchema.parse(req.body);
  return await prisma.messageSeen.create({
    data: {
      messageId,
      userId,
    },
  });
};

// Function to get the top emojis for a message with total count
async function getTopEmojisWithTotalCountForMessage(
  messageId: string,
  cursor?: string,
  limit: number = 4
) {
  const { topEmojis, nextCursor } = await getTopEmojisWithTotalCount(
    messageId,
    cursor,
    limit
  );
  return { topEmojis, nextCursor };
}

export {
  createMessage,
  getMessages,
  markMessageAsSeen,
  getTopEmojisWithTotalCountForMessage,
  getSeenUsersWithPagination,
};
