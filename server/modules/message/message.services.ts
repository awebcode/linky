import type { Request } from "express";
import prisma from "../../libs/prisma";
import {
  CreateMessageSchema,
  GetMessagesSchema,
  MarkMessageAsSeenSchema,
} from "./message.dtos";
import { uploadMultipleFiles } from "../../config/cloudinary.config";

// Helper function to get top emojis with total count and pagination support
async function getTopEmojisWithTotalCount(
  messageId: string,
  cursor?: string,
  limit: number = 4
) {
  const [reactions, totalCount] = await prisma.$transaction([
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
      count: reaction?._count,
    })),
    nextCursor,
  };
}

// Main function to create a message
const createMessage = async (req: Request) => {
  const { content, chatId } = CreateMessageSchema.parse(req.body);
  const senderId = req.user.id;

  const createData = {
    content,
    senderId,
    chatId,
  };

  if (req.files && (req.files as Express.Multer.File[]).length) {
    const uploadedFiles = await uploadMultipleFiles(req);
    (createData as any)["media"] = {
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
/**
 * @title Function to get messages
 * @param req 
 * @returns  Object
 */
const getMessages = async (req: Request) => {

  // Validate and parse query parameters using your schema
  const { chatId, cursor,take } = GetMessagesSchema.parse({
    ...req.query,
    chatId: req.params.chatId,
  });

  // Prisma Query Optimization: Group reactions by messageId at the database level
  const messages = await prisma.message.findMany({
    where: { chatId },
    select: {
      id: true,
      content: true,
      sentAt: true,
      status: true,
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
          status: true,
          lastActive: true,
        },
      },
      media: { take: 5, select: { id: true, type: true, url: true } },
      reactions: {
        select: {
          emoji: true,
        },
      },
      MessageSeen: {
        take: 5,
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              status: true,
              lastActive: true,
            },
          },
        },
      },
      _count: {
        select: {
          reactions: true,
          MessageSeen: true,
          media: true,

        },

      },
    },
    
    take:take,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { sentAt: "desc" }, // Sort by sentAt in descending order
  });

  // Optimize: Directly process reactions in memory (not by `flatMap`)
  const messagesWithReactions = await Promise.all(
    messages.map(async (message) => {
      // Group reactions by emoji and count them
      const reactionCounts = message.reactions.reduce<{ [emoji: string]: number }>(
        (acc, { emoji }) => {
          acc[emoji] = (acc[emoji] || 0) + 1;
          return acc;
        },
        {}
      );

      const topReactions = Object.entries(reactionCounts)
        .sort(([, a], [, b]) => b - a) // Sort by count, descending
        .slice(0, 4)
        .map(([emoji, count]) => ({ emoji, count }));

      // Get the total count of reactions
      // const totalReactionsCount = Object.values(reactionCounts).reduce(
      //   (sum, count) => sum + count,
      //   0
      // );

      // Get the top 5 seen users
      const topSeenUsers = message.MessageSeen.slice(0, 5).map((seen) => seen.user);

      // Get the total count of seen users
      const totalSeenUsersCount = message._count.MessageSeen;

      // Get the total count of reactions
      const totalReactionsCount = message._count.reactions;
      const totalMediaCount = message._count.media;

      return {
        ...message,
        reactions: topReactions,
        totalReactionsCount,
        seenUsers: topSeenUsers,
        totalSeenUsersCount,
        totalMediaCount,
      };
    })
  );
 const totalMessagesCount = await prisma.message.count({ where: { chatId } });
  // Return the processed messages along with the next cursor for pagination
  return {
    messages: messagesWithReactions,
    nextCursor: messages.length ===take ? messages[messages.length - 1].id : null,
    totalMessagesCount
  };
};


// Function to get seen users with pagination
// async function getSeenUsersWithPagination(
//   messageId: string,
//   cursor?: string,
//   limit: number = 10
// ) {
//   const { seenUsers, nextCursor } = await getSeenUsers([messageId], cursor, limit);
//   return { seenUsers, nextCursor };
// }

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
};
