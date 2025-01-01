// services/chatService.ts

import type { Request } from "express";
import prisma from "../../libs/prisma";
import { AddUserToChatSchema, CreateChatSchema, GetChatsQuerySchema } from "./chat.dtos";
import { AppError } from "../../middlewares/errors-handle.middleware";
import { formatChat, generateRandomAvatar } from "./chat.utils";
import { uploadSingleFile } from "../../config/cloudinary.config";
import { Status } from "@prisma/client";

// Create Chat - Updated to support multiple admins
const createChat = async (req: Request) => {
  const { members, isGroupChat = false, name } = CreateChatSchema.parse(req.body);

  // Ensure the chat has valid member count based on its type
  if ((!isGroupChat && members.length > 1) || (isGroupChat && members.length < 2)) {
    throw new AppError(
      isGroupChat
        ? "Group chats must have at least 2 members"
        : "Non-group chats can only have 1 member",
      400
    );
  }

  const adminId = req.user.id;
  const allAdmins = [adminId]; // Include the current user as an admin

  // Prepare members list with the admins included
  const chatMembers = [
    { userId: adminId },
    ...members.map((userId: string) => ({ userId })),
  ];

  // Determine chat image (either uploaded or random)
  const image = req.file
    ? await uploadSingleFile(req)
    : generateRandomAvatar(isGroupChat ? name : undefined);

  // Create the chat in the database
  return prisma.chat.create({
    data: {
      name,
      admins: { createMany: { data: allAdmins.map((id) => ({ userId: id })) } }, // Save multiple admins
      image: typeof image === "string" ? image : image.url,
      isGroup: isGroupChat,
      members: {
        createMany: { data: chatMembers },
      },
    },
  });
};

// Add User to Chat - No change needed for this
const addUserToChat = async (req: Request) => {
  const { userId, chatId } = AddUserToChatSchema.parse(req.body);
  return await prisma.chatMember.create({
    data: {
      userId,
      chatId,
    },
  });
};

// Get chats - Include admins in the response
const getChats = async (req: Request) => {
  const userId = req.user.id;
  const { search = "", cursor, take = 1,nextUnlistedCursor } = GetChatsQuerySchema.parse(req.query);

  // Query the chat members and associated metadata for pagination
  const results = await prisma.chatMember.findMany({
    where: {
      userId, // Ensure the current user is a member of the chat
      chat: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              {
                members: {
                  some: {
                    user: {
                      email: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              },
            ],
          }
        : undefined,
    },
    include: {
      chat: {
        select: {
          id: true,
          isGroup: true,
          createdAt: true,
          name: true,
          image: true,
          admins: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  status: true,
                },
              },
            },
          },
          messages: {
            take: 1,
            orderBy: { sentAt: "desc" },
          },
          members: {
            where: { userId: { not: userId } },
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  status: true,
                },
              },
            },
            take: 1, // Limit to 1 member for non-current user
          },
          NotificationStatus: {
            where: { userId },
            select: {
              status: true,
              mutedUntil: true,
            },
          },
          blockedUsers: {
            where: { userId, blockedUntil: { gte: new Date() } },
            select: {
              id: true,
              userId: true,
              blockedByUser: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  status: true,
                },
              },
              blockedUntil: true,
            },
          },
          _count: {
            select: {
              members: true,
              admins: true,
            },
          },
        },
      },
    },
    take,
    skip: cursor ? take : 0, // Skip the first page if cursor exists
    cursor: cursor ? { id: cursor } : undefined, // Pagination cursor
    orderBy: [
      { pinnedAt: "desc" }, // Sort pinned chats first
      { id: "asc" }, // Default sort by ID
    ],
  });

  // Map through results and structure response data
  const filteredChats = results.map((chatMember) => {
    const chat = chatMember.chat;
    const blockedUser = chat.blockedUsers.find((block) => block.userId === userId);

    return {
      ...formatChat(chatMember, userId),
      membersCount: chat._count.members,
      adminsCount: chat._count.admins,
      admins: chat.admins.map((admin) => admin.user), // Returning admin details
      notificationStatus: chat.NotificationStatus[0] || null,
      blockedStatus: blockedUser
        ? {
            status: "BLOCKED",
            blockedBy: blockedUser.blockedByUser,
            blockedUntil: blockedUser.blockedUntil,
          }
        : null,
      archivedAt: chatMember.archivedAt, // Add archivedAt to response
      pinnedAt: chatMember.pinnedAt, // Add pinnedAt to response
    };
  });

  // Fetch unlisted users based on the search query
  const unlistedUsers = search
    ? await prisma.user.findMany({
        where: {
          AND: [
            {
              id: {
                notIn: results
                  .map((chatMember) =>
                    chatMember.chat.members.map((member) => member.user.id)
                  )
                  .flat(),
              },
            }, // Exclude users who are already members of any chat with the current user
            {
              OR: [
                { email: { contains: search, mode: "insensitive" } },
                { name: { contains: search, mode: "insensitive" } },
              ],
            },
          ],
        },
        select: {
          id: true,
          name: true,
          image: true,
          status: true,
          
          lastActive: true,
        },
        skip: nextUnlistedCursor ? 1 : 0,
        cursor: nextUnlistedCursor ? { id: nextUnlistedCursor } : undefined,
        take,
        orderBy: { name: "asc" },
      })
    : [];

  // Get total count of chat members for the user
  const totalCount = await getTotalChatMembersCount(userId, search);

  return {
    chats: filteredChats,
    nextCursor: results.length > 0 ? results[results.length - 1].id : null,
    totalCount,
    nextUnlistedCursor: unlistedUsers.length > 0 ? unlistedUsers[unlistedUsers.length - 1].id : null,
    unlistedUsers, // Add unlisted users in the response
  };
};

// Service to count the total number of chat members for a user
const getTotalChatMembersCount = async (
  userId: string,
  search: string = ""
): Promise<number> => {
  const count = await prisma.chatMember.count({
    where: {
      userId,
      archivedAt: null, // Exclude archived chats
      chat: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              {
                members: {
                  some: {
                    user: { email: { contains: search, mode: "insensitive" } },
                  },
                },
              },
            ],
          }
        : undefined,
    },
  });

  return count;
};

// Function to get online users in a chat with cursor-based pagination
const getOnlineUsersInChat = async (
  chatId: string,
  // userId: string,
  cursor?: string,
  batchSize: number = 100
) => {
  const onlineUsers = await prisma.chatMember.findMany({
    where: {
      chatId: chatId,
      user: {
        status: Status.ONLINE,
      },
      // userId: { not: userId }, // Exclude the current user from the online users
    },

    select: {
      id: true,
      user: {
        select: {
          id: true,
        },
      },
    },
    take: batchSize, // Limit the number of online users
    cursor: cursor ? { id: cursor } : undefined, // Use cursor if provided
    skip: cursor ? 1 : 0, // Skip the cursor itself if provided
  });

  const nextCursor =
    onlineUsers.length === batchSize ? onlineUsers[onlineUsers.length - 1].id : null;
  return {
    onlineUsers,
    nextCursor,
  };
};

const getOnlineUsersInUserChats = async (
  userId: string,
  cursor?: string,
  batchSize: number = 100
) => {
  // Fetch the list of chats where the user is a member
  const chatMembers = await prisma.chatMember.findMany({
    where: {
      chat: {
        isGroup: false, // Filter for non-group chats
      },
      userId: userId, // Fetch chats where the user is a member
    },
    select: {
      chatId: true, // Get the chatId for each chat the user is a member of
    },
    take: batchSize, // Paginate the chats for the user
    cursor: cursor ? { id: cursor } : undefined, // Use cursor for pagination
  });

  // Extract chatIds from the chats where the user is a member
  const chatIds = chatMembers.map((member) => member.chatId);

  // Fetch all online users in these chats (excluding the current user)
  const onlineUsers = await prisma.chatMember.findMany({
    where: {
      chatId: { in: chatIds }, // Filter by the chats the user is a member of
      user: {
        status: Status.ONLINE, // Filter for online users
      },
      // userId: { not: userId }, // Exclude the current user from the online users
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
        },
      },
    },
    take: batchSize, // Limit the number of online users per chat
    cursor: cursor ? { id: cursor } : undefined, // Use cursor for pagination
  });

  // Prepare nextCursor for pagination
  const nextCursor =
    onlineUsers.length === batchSize ? onlineUsers[onlineUsers.length - 1].id : null;

  return { onlineUsers, nextCursor };
};

// Delete all chats - no change
const deleteAllChats = async (req: Request) => {
  return await prisma.chat.deleteMany();
};

export {
  createChat,
  addUserToChat,
  getChats,
  deleteAllChats,
  getOnlineUsersInChat,
  getOnlineUsersInUserChats,
  getTotalChatMembersCount,
};
