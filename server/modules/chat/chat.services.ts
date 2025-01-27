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
import { modifyUserGroupsRedis } from "../socket/redis.services";

// Create Chat - Updated to support multiple admins and Redis group updates
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

  // If it's not a group chat, check if a one-on-one chat already exists
  if (!isGroupChat) {
    const existingChat = await prisma.chat.findFirst({
      where: {
        isGroup: false,
        members: {
          every: {
            OR: [{ userId: adminId }, { userId: members[0] }],
          },
        },
      },
      include: {
        members: true,
      },
    });

    // If the existing one-on-one chat is found, return it
    if (existingChat) {
      return existingChat;
    }
  }

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

  // If it's a group chat, add the chat ID to each member's group list in Redis
  if (isGroupChat) {
    await Promise.all(
      chatMembers.map(async (member) => {
        await modifyUserGroupsRedis({
          userId: member.userId,
          groupIds: [createdChat.id],
          operation: "add",
        });
      })
    );
  }

  return createdChat;
};

// Add User to Chat - Updated to include Redis updates for group chats
const addUserToChat = async (req: Request) => {
  const { userId, chatId } = AddUserToChatSchema.parse(req.body);
  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat) throw new AppError("Chat not found", 404);
  if (!chat.isGroup) throw new AppError("Chat is not a group chat", 400);
  // Add the group ID to the user's group list in Redis
  if (chat?.isGroup) {
    await modifyUserGroupsRedis({
      userId,
      groupIds: [chatId],
      operation: "add",
    });
  }
  const addedUser = await prisma.chatMember.create({
    data: {
      userId,
      chatId,
    },
  });

  return addedUser;
};

// Remove User from Chat - Updated to include Redis updates for group chats
const removeUserFromChat = async (req: Request) => {
  const { userId, chatId } = AddUserToChatSchema.parse(req.body);
  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat) throw new AppError("Chat not found", 404);
  if(!chat.isGroup) throw new AppError("Chat is not a group chat", 400);
  if (chat?.isGroup) {
    // Remove the group ID from the user's group list in Redis

    await modifyUserGroupsRedis({
      userId,
      groupIds: [chatId],
      operation: "remove",
    });
  }
  const removedUser = await prisma.chatMember.delete({
    where: {
      userId_chatId: {
        userId,
        chatId,
      },
    },
  });

  return removedUser;
};

// const getChats = async (req: Request) => {
//   const userId = req.user.id;
//   const {
//     search = "",
//     cursor,
//     take = 10,
//     nextUnlistedCursor,
//     filter,
//     chatIds,
//   } = GetChatsQuerySchema.parse(req.query);

//   // Query the chat members and associated metadata for pagination
//   const results = await prisma.chatMember.findMany({
//     where: {
//       userId,
//       // Ensure the current user is a member of the chat
//       // Filter based on favoriteAt and unread chats (filtering for favorite chats or unread chats)
//       favoriteAt: filter === "favorite" ? { not: null } : undefined,
//       lastSeenAt: filter === "unread" ? { not: null } : undefined,
//       chat: {
//         id: { in: chatIds },
//         // Search logic for chat name or member email
//         ...(search && {
//           OR: [
//             { name: { contains: search, mode: "insensitive" } },
//             {
//               members: {
//                 some: {
//                   user: {
//                     email: {
//                       contains: search,
//                       mode: "insensitive",
//                     },
//                   },
//                 },
//               },
//             },
//           ],
//         }),

//         // Apply group filtering if the filter is not "all"
//         isGroup: filter && filter !== "all" ? filter === "groups" : undefined,
//       },
//     },
//     include: {
//       chat: {
//         select: {
//           id: true,
//           isGroup: true,
//           createdAt: true,
//           name: true,
//           image: true,
//           admins: {
//             select: {
//               user: {
//                 select: {
//                   id: true,
//                   name: true,
//                   image: true,
//                   status: true,
//                 },
//               },
//             },
//           },
//           messages: {
//             take: 1, // Only take the most recent message
//             orderBy: { sentAt: "desc" },
//             select: {
//               id: true,
//               content: true,
//               updatedAt: true,
//               sentAt: true,
//               status: true,
//               sender: {
//                 select: {
//                   id: true,
//                   name: true,
//                   image: true,
//                   // status: true,
//                 },
//               },
//               // media: { take: 5, select: { id: true, type: true, url: true } },
//             },
//           },
//           members: {
//             where: { userId: { not: userId } }, // Exclude current user from members
//             select: {
//               user: {
//                 select: {
//                   id: true,
//                   name: true,
//                   image: true,
//                   status: true,
//                 },
//               },
//             },
//             take: 1, // Limit to 1 member for non-current user (the first member for the chat)
//           },
//           NotificationStatus: {
//             where: { userId },
//             select: {
//               status: true,
//               mutedUntil: true,
//             },
//           },
//           blockedUsers: {
//             where: { userId, blockedUntil: { gte: new Date() } }, // Only include blocked users whose block is active
//             select: {
//               id: true,
//               userId: true,
//               blockedByUser: {
//                 select: {
//                   id: true,
//                   name: true,
//                   image: true,
//                   status: true,
//                 },
//               },
//               blockedUntil: true,
//             },
//           },
//           _count: {
//             select: {
//               members: true,
//               admins: true,
//             },
//           },
//         },
//       },
//     },

//     take, // Number of records per page (pagination)
//     skip: cursor ? 1 : 0, // Skip based on the cursor
//     cursor: cursor ? { id: cursor } : undefined, // Pagination cursor
//     orderBy: [
//       { updatedAt: "desc" },
//       // { pinnedAt: "desc" }, // Sort pinned chats first
//       // { id: "asc" }, // Default sort by chat ID **desc for get new created chat first
//     ],
//   });
//   const nextCursor = results.length === take ? results[results.length - 1].id : null;
//   // results.sort((a, b) => {
//   //   // Get the latest message updatedAt date or default to a very old date
//   //   const aUpdatedAt = a.chat.messages[0]?.updatedAt ?? new Date(0);
//   //   const bUpdatedAt = b.chat.messages[0]?.updatedAt ?? new Date(0);

//   //   // Get the chat createdAt date
//   //   const aCreatedAt = a.chat.createdAt;
//   //   const bCreatedAt = b.chat.createdAt;

//   //   // Define sorting priority:
//   //   // 1. Newer messages (by updatedAt)
//   //   // 2. Newly created chats (no messages)
//   //   // 3. Older chats/messages (by createdAt)

//   //   if (a.chat.messages.length > 0 && b.chat.messages.length > 0) {
//   //     // Both chats have messages -> Sort by updatedAt (newest first)
//   //     return bUpdatedAt.getTime() - aUpdatedAt.getTime();
//   //   } else if (a.chat.messages.length === 0 && b.chat.messages.length === 0) {
//   //     // Neither chat has messages -> Sort by createdAt (newest first)
//   //     return bCreatedAt.getTime() - aCreatedAt.getTime();
//   //   } else {
//   //     // One chat has messages and the other doesn't -> Prioritize chats with messages
//   //     return b.chat.messages.length - a.chat.messages.length;
//   //   }
//   // });

//   // Map through results and structure response data
//   const onlineUsers=await prisma.chatMember.findMany({
//     where: {
//       chat: {
//         members: { some: { userId } }, // Fetch chats where the current user is a member
//       },
//       user: { status: Status.ONLINE, id: { not: userId } }, // Exclude the current user
//     },
//     select: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           image: true,
//           status: true,
//         },
//       }

//     },
//     take:2
//   })
//   const filteredChats = results.map((chatMember) => {
//     const chat = chatMember.chat;
//     const blockedUser = chat.blockedUsers.find((block) => block.userId === userId);

//     return {
//       ...formatChat(chatMember, userId),
//       membersCount: chat._count.members,
//       adminsCount: chat._count.admins,
//       admins: chat.admins.map((admin) => admin.user), // Returning admin details
//       notificationStatus: chat.NotificationStatus[0] || null,
//       blockedStatus: blockedUser
//         ? {
//             status: "BLOCKED",
//             blockedBy: blockedUser.blockedByUser,
//             blockedUntil: blockedUser.blockedUntil,
//           }
//         : null,
//       archivedAt: chatMember.archivedAt, // Add archivedAt to response
//       pinnedAt: chatMember.pinnedAt, // Add pinnedAt to response
//       favoriteAt: chatMember.favoriteAt, // Add favoriteAt to response
//       lastSeenAt: chatMember.lastSeenAt, // Add lastSeenAt to response
//     };
//   });

//   // Fetch unlisted users based on the search query
//   const unlistedUsers = search
//     ? await prisma.user.findMany({
//         where: {
//           AND: [
//             {
//               id: {
//                 notIn: results
//                   .map((chatMember) =>
//                     chatMember.chat.members.map((member) => member.user.id)
//                   )
//                   .flat(),
//               },
//             }, // Exclude users who are already members of any chat with the current user
//             {
//               OR: [
//                 { email: { contains: search, mode: "insensitive" } },
//                 { name: { contains: search, mode: "insensitive" } },
//               ],
//             },
//           ],
//         },
//         select: {
//           id: true,
//           name: true,
//           image: true,
//           status: true,

//           lastActive: true,
//         },
//         take,

//         skip: nextUnlistedCursor ? 1 : 0,
//         cursor: nextUnlistedCursor ? { id: nextUnlistedCursor } : undefined,
//         orderBy: { name: "asc" },
//       })
//     : [];

//   return {
//     chats: filteredChats,
//     nextCursor,
//     // totalChatMembersCount,
//     nextUnlistedCursor:
//       unlistedUsers.length === take ? unlistedUsers[unlistedUsers.length - 1].id : null,
//     unlistedUsers, // Add unlisted users in the response
//     // chatCounts
//   };
// };
const getChats = async (req: Request) => {
  const userId = req.user.id;
  const {
    search = "",
    cursor,
    take = 10,
    nextUnlistedCursor,
    filter,
  } = GetChatsQuerySchema.parse(req.query);

  // Query the chat members and associated metadata for pagination
  const results = await prisma.chatMember.findMany({
    where: {
      userId,
      favoriteAt: filter === "favorite" ? { not: null } : undefined,
      lastSeenAt: filter === "unread" ? { not: null } : undefined,
      chat: {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            {
              members: {
                some: {
                  user: {
                    email: { contains: search, mode: "insensitive" },
                  },
                },
              },
            },
          ],
        }),
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
            take: 1,
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
                },
              },
            },
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
            take: 1,
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
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
   orderBy: [{ updatedAt: "desc" }, { id: "asc" }], // Added secondary ordering by id
  });

  const nextCursor = results.length === take ? results[results.length - 1].id : null;
  

  // Get online users for fetched chats
  const chatIdsToFetch = results.map((chatMember) => chatMember.chat.id);
  const onlineUsers = await prisma.chatMember.findMany({
    where: {
      chatId: { in: chatIdsToFetch },
      user: {
        status: Status.ONLINE, // Only online users
        id: { not: userId }, // Exclude the current user
      },
    },
    select: {
      chatId: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  // Group online users by chatId
  const onlineUsersByChat = onlineUsers.reduce<
    Record<string, (typeof onlineUsers)[0]["user"][]>
  >((acc, { chatId, user }) => {
    acc[chatId] = acc[chatId] || [];
    acc[chatId].push(user);
    return acc;
  }, {});

  const filteredChats = results.map((chatMember) => {
    const chat = chatMember.chat;
    const blockedUser = chat.blockedUsers.find((block) => block.userId === userId);

    return {
      ...formatChat(chatMember, userId),
      membersCount: chat._count.members,
      adminsCount: chat._count.admins,
      admins: chat.admins.map((admin) => admin.user),
      notificationStatus: chat.NotificationStatus[0] || null,
      blockedStatus: blockedUser
        ? {
            status: "BLOCKED",
            blockedBy: blockedUser.blockedByUser,
            blockedUntil: blockedUser.blockedUntil,
          }
        : null,
      archivedAt: chatMember.archivedAt,
      pinnedAt: chatMember.pinnedAt,
      favoriteAt: chatMember.favoriteAt,
      lastSeenAt: chatMember.lastSeenAt,
      onlineUsers: onlineUsersByChat[chat.id] || [],
      totalOnlineUsers: (onlineUsersByChat[chat.id] || []).length,
    };
  });

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
            },
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
    nextUnlistedCursor:
      unlistedUsers.length === take ? unlistedUsers[unlistedUsers.length - 1].id : null,
    unlistedUsers,
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
  const someRecentTimeThreshold = new Date(Date.now() - 60 * 60 * 1000); // Last 1 hour
  // Step 1: Fetch chatIds where the user is a member and at least one other user is online
  const chatsWithOnlineUsers = await prisma.chat.findMany({
    where: {
      AND: [{ members: { some: { userId } } }],
    },
    // where: {
    //   userId: userId,
    //   user: {
    //     status: Status.ONLINE,
    //   },
    //   // userId: { not: userId }, // Exclude the current user from the online users
    // },
    select: {
      id: true,
    },
    take: batchSize,
    cursor: userCursor ? { id: userCursor } : undefined,
    orderBy: { updatedAt: "desc" }, // Order by updatedAt or any other desired field
  });

  const nextCursor =
    chatsWithOnlineUsers.length === batchSize
      ? chatsWithOnlineUsers[chatsWithOnlineUsers.length - 1].id
      : null;

  return { chatIds: chatsWithOnlineUsers.map((chat) => chat.id), nextCursor };
};

/**
 * @description Get unique online users across chats for a given user
 * @param req Request
 * @returns Unique online users in the chats of the current user
 */
const getOnlineConversationsForClient = async (req: Request) => {
  const { userCursor, take = 10 } = GetOnlineConversationsSchema.parse({
    ...req.query,
    userId: req.user.id,
  });
  const userId = req.user.id;

  // Step 1: Fetch online users across chats in a single query
  const onlineUsers = await prisma.chatMember.findMany({
    where: {
      chat: {
        isGroup: false,
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

    // distinct: ["userId"], // Ensure unique users
    take,
    cursor: userCursor ? { id: userCursor } : undefined,
    orderBy: { updatedAt: "desc" },
  });

  // Step 2: Count total unique online users directly from the database
  const totalOnlineChatMembersCount = (
    await prisma.chatMember.findMany({
      where: {
        chat: {
          isGroup: false,
          members: { some: { userId } },
        },
        user: { status: Status.ONLINE, id: { not: userId } },
      },
      // distinct: ["userId"],
    })
  ).length;

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
  removeUserFromChat,
  getChats,
  deleteAllChats,
  getOnlineConversationIdsByChatId,
  getOnlineConversationIdsByUserId,
  getOnlineConversationsForClient,
  getTotalChatMembersCount,
};
