// services/chatService.ts

import type { Request } from "express";
import prisma from "../../libs/prisma";
import {
  AddUserToChatSchema,
  CreateChatSchema,
  GetChatsQuerySchema,
  GetOnlineConversationsSchema,
} from "./chat.dtos";
import { AppError } from "../../middlewares/errors-handle.middleware";
import { formatChat, generateRandomAvatar, getTotalChatMembersCount } from "./chat.utils";
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
  const image = req.file ? await uploadSingleFile(req) : generateRandomAvatar(name);

  // Create the chat in the database
  const createdChat = await prisma.chat.create({
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
  /**
   * Join the socket room for the newly created chat
   */
  // io.socketsJoin(createdChat.id);

  return;
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

const getChats = async (req: Request) => {
  const userId = req.user.id;
  const {
    search = "",
    cursor,
    take = 10,
    nextUnlistedCursor,
    filter,
    chatIds,
  } = GetChatsQuerySchema.parse(req.query);

  // Query the chat members and associated metadata for pagination
  const results = await prisma.chatMember.findMany({
    where: {
      userId,
      // Ensure the current user is a member of the chat
      // Filter based on favoriteAt and unread chats (filtering for favorite chats or unread chats)
      favoriteAt: filter === "favorite" ? { not: null } : undefined,
      lastSeenAt: filter === "unread" ? { not: null } : undefined,
      chat: {
        id: { in: chatIds },
        // Search logic for chat name or member email
        ...(search && {
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
        }),

        // Apply group filtering if the filter is not "all"
        isGroup: filter && filter !== "all" ? filter === "groups" : undefined,
      },
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
            take: 1, // Only take the most recent message
            orderBy: { sentAt: "desc" },
            select: {
              id: true,
              content: true,
              updatedAt: true,
              sentAt: true,
              status: true,
              sender: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  // status: true,
                },
              },
              // media: { take: 5, select: { id: true, type: true, url: true } },
            },
          },
          members: {
            where: { userId: { not: userId } }, // Exclude current user from members
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
            take: 1, // Limit to 1 member for non-current user (the first member for the chat)
          },
          NotificationStatus: {
            where: { userId },
            select: {
              status: true,
              mutedUntil: true,
            },
          },
          blockedUsers: {
            where: { userId, blockedUntil: { gte: new Date() } }, // Only include blocked users whose block is active
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

    take, // Number of records per page (pagination)
    skip: cursor ? 1 : 0, // Skip based on the cursor
    cursor: cursor ? { id: cursor } : undefined, // Pagination cursor
    orderBy: [
      { updatedAt: "desc" },
      // { pinnedAt: "desc" }, // Sort pinned chats first
      // { id: "asc" }, // Default sort by chat ID **desc for get new created chat first
    ],
  });
  const nextCursor = results.length === take ? results[results.length - 1].id : null;
  // results.sort((a, b) => {
  //   // Get the latest message updatedAt date or default to a very old date
  //   const aUpdatedAt = a.chat.messages[0]?.updatedAt ?? new Date(0);
  //   const bUpdatedAt = b.chat.messages[0]?.updatedAt ?? new Date(0);

  //   // Get the chat createdAt date
  //   const aCreatedAt = a.chat.createdAt;
  //   const bCreatedAt = b.chat.createdAt;

  //   // Define sorting priority:
  //   // 1. Newer messages (by updatedAt)
  //   // 2. Newly created chats (no messages)
  //   // 3. Older chats/messages (by createdAt)

  //   if (a.chat.messages.length > 0 && b.chat.messages.length > 0) {
  //     // Both chats have messages -> Sort by updatedAt (newest first)
  //     return bUpdatedAt.getTime() - aUpdatedAt.getTime();
  //   } else if (a.chat.messages.length === 0 && b.chat.messages.length === 0) {
  //     // Neither chat has messages -> Sort by createdAt (newest first)
  //     return bCreatedAt.getTime() - aCreatedAt.getTime();
  //   } else {
  //     // One chat has messages and the other doesn't -> Prioritize chats with messages
  //     return b.chat.messages.length - a.chat.messages.length;
  //   }
  // });

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
      favoriteAt: chatMember.favoriteAt, // Add favoriteAt to response
      lastSeenAt: chatMember.lastSeenAt, // Add lastSeenAt to response
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
        take,

        skip: nextUnlistedCursor ? 1 : 0,
        cursor: nextUnlistedCursor ? { id: nextUnlistedCursor } : undefined,
        orderBy: { name: "asc" },
      })
    : [];

  return {
    chats: filteredChats,
    nextCursor,
    // totalChatMembersCount,
    nextUnlistedCursor:
      unlistedUsers.length === take ? unlistedUsers[unlistedUsers.length - 1].id : null,
    unlistedUsers, // Add unlisted users in the response
    // chatCounts
  };
};

// Function to get online users in a chat with cursor-based pagination
const getOnlineConversationIdsByChatId = async (
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
      chatId: true,
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
// /**
//  * @description Get online users in user's chats for socketIo
//  * @param userId
//  * @param chatCursor
//  * @param userCursor
//  * @param batchSize
//  * @returns
//  */
// const getOnlineConversationIdsByUserId = async (
//   userId: string,
//   userCursor?: string,
//   batchSize: number = 100
// ) => {
//   // Step 1: Fetch online users across chats in a single query
//   const onlineUsers = await prisma.chatMember.findMany({
//     where: {
//       chat: {
//         members: { some: { userId } }, // Fetch chats where the current user is a member
//       },
//       user: { status: Status.ONLINE, id: { not: userId } }, // Exclude the current user
//     },
//     select: {
//       chatId: true,
//       id: true,
//       user: {
//         select: { id: true },
//       },
//     },
//     distinct: ["userId"], // Ensure unique users
//     take: batchSize,
//     cursor: userCursor ? { id: userCursor } : undefined,
//     orderBy: { updatedAt: "desc" },
//   });
//   const nextCursor =
//     onlineUsers.length === batchSize ? onlineUsers[onlineUsers.length - 1].id : null;
 

//   return { onlineUsers, nextCursor};
// };
/**
 * @description Get chatIds where the user is a member and at least one other user is online
 * @param userId
 * @param userCursor
 * @param batchSize
 * @returns
 */
const getOnlineConversationIdsByUserId = async (
  userId: string,
  userCursor?: string,
  batchSize: number = 100
) => {
  // Step 1: Fetch chatIds where the user is a member and at least one other user is online
  const chatsWithOnlineUsers = await prisma.chatMember.findMany({
    where: {
      chat: {
        members: { some: { user: { status: Status.ONLINE, id: { not: userId } } } }, // At least one other online user
      },
    },
    select: {
      chatId: true,
      id: true,
    },
    distinct: ["chatId"], // Ensure unique chatIds
    take: batchSize,
    cursor: userCursor ? { id: userCursor } : undefined,
    orderBy: { updatedAt: "desc" }, // Order by updatedAt or any other desired field
  });

  const nextCursor =
    chatsWithOnlineUsers.length === batchSize
      ? chatsWithOnlineUsers[chatsWithOnlineUsers.length - 1].id
      : null;

  return { chatIds: chatsWithOnlineUsers.map((chat) => chat.chatId), nextCursor };
};

/**
 * @description Get unique online users across chats for a given user
 * @param req Request
 * @returns Unique online users in the chats of the current user
 */
const getOnlineConversationsForClient = async (req: Request) => {
  const {
    chatCursor,
    userCursor,
    take = 10,
  } = GetOnlineConversationsSchema.parse({
    ...req.query,
    userId: req.user.id,
  });
  const userId = req.user.id;

  // Step 1: Fetch online users across chats in a single query
  const onlineUsers = await prisma.chatMember.findMany({
    where: {
      chat: {
        members: { some: { userId } }, // Fetch chats where the current user is a member
      },
      user: { status: Status.ONLINE, id: { not: userId } }, // Exclude the current user
    },
    select: {
      chatId: true,
      id: true,
      user: {
        select: { id: true, name: true, image: true, status: true, lastActive: true },
      },
    },
    distinct: ["userId"], // Ensure unique users
    take,
    cursor: userCursor ? { id: userCursor } : undefined,
    orderBy: { updatedAt: "desc" },
  });

  // Step 2: Count total unique online users directly from the database
  const totalOnlineChatMembersCount = (await prisma.chatMember.findMany({
    where: {
      chat: {
        members: { some: { userId } },
      },
      user: { status: Status.ONLINE, id: { not: userId } },
    },
    distinct: ["userId"],
  })).length;

  // Step 3: Determine pagination cursors
  const nextUserCursor =
    onlineUsers.length === take ? onlineUsers[onlineUsers.length - 1].id : null;

  // Step 4: Format the response
  return {
    onlineChatMembers: onlineUsers.map((member) => ({
      chatId: member.chatId,
      id: member.id,
      onlineUser: member.user,
    })),
    totalOnlineChatMembersCount,
    nextUserCursor,
  };
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
  getOnlineConversationIdsByChatId,
  getOnlineConversationIdsByUserId,
  getOnlineConversationsForClient,
  getTotalChatMembersCount,
};
