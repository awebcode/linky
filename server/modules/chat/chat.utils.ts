import { faker } from "@faker-js/faker";
import * as chatService from "./chat.services";
/**
 * Fetches a random avatar using Faker.
 * @returns A random avatar string (image URL or text).
 */
const generateRandomAvatar = (name?: string): string => {
  // You can generate a random avatar URL or initials using Faker
  const randomName = name || faker.person.firstName(); // Get a random first name
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    randomName
  )}&background=random&color=fff`; // URL-based random avatar
  return avatarUrl; // You can also use the name, or any other logic for avatars
};
/**
 * Fetch the latest message in a chat.
 */

/**
 * Format a chat object for response.
 */
const formatChat = (chatMember: any, userId: string) => {
  const { chat } = chatMember;
  
  // Fetch the last message (assuming `messages` is sorted by `sentAt`)
  const lastMessage = chat.messages?.[0] || null;

  // Calculate unread count (if no records in MessageSeen)
  const unreadCount = chat.messages.filter(
    (msg: any) => msg.MessageSeen.length === 0 && msg.senderId !== userId
  ).length;

  // Get the first member for user details (this is typically the chat initiator for 1:1 chats)
  const user = chat.members.find((member: any) => member.userId !== userId)?.user || null;

  return {
    id: chat.id,
    isGroup: chat.isGroup,
    groupInfo: chat.isGroup ? {
      groupId: chat.id,
      groupName: chat.name,
      groupImage: chat.image || '', // Default empty image if not set
      createdAt: chat.createdAt.toISOString(),
    } : null, // Only include group info if it's a group chat
    user: user ? {
      id: user.id,
      name: user.name || '',
      image: user.image || '',
      status: user.status, // Default status as 'offline' if missing
    } : null, // 1:1 user chat info
    lastMessage: lastMessage || null,
    createdAt: chat.createdAt.toISOString(),
    unreadCount,
    membersCount: chat.members.length,
    archivedAt: chatMember.archivedAt || null, // Optional, based on whether archived
    pinnedAt: chatMember.pinnedAt || null, // Optional, based on whether pinned
  };
};


/**
 *  Utility function to fetch all online users in batches
 * @param chatId 
 * @param batchSize 
 * @returns onlineUsersResponse[]
 */
interface OnlineUserResponse {
  user: {
    id: string;
  };
  id: string;
}
const fetchBatchAllOnlineUsersInChat = async (chatId: string, batchSize: number = 50) => {
  let allOnlineUsers: OnlineUserResponse[] = [];
  let cursor: string | undefined

  while (true) {
    const { onlineUsers, nextCursor } = await chatService.getOnlineUsersInChat(chatId, cursor, batchSize);
    console.log({ onlineUsers, nextCursor })
    allOnlineUsers = allOnlineUsers.concat(onlineUsers);

    if (!nextCursor) {
      break;
    }

    cursor = nextCursor;
  }

  return allOnlineUsers;
};

/**
 *  Utility function to fetch all online users in batches
 * @param chatId 
 * @param batchSize 
 * @returns onlineUsersResponse[]
 */

const fetchBatchAllOnlineUsersInUserChat = async (userId: string, batchSize: number = 50) => {
  let allOnlineUsers:OnlineUserResponse[] = [];
  let cursor: string | undefined

  while (true) {
    const { onlineUsers, nextCursor } = await chatService.getOnlineUsersInUserChats(userId, cursor, batchSize);
    allOnlineUsers = allOnlineUsers.concat(onlineUsers);

    if (!nextCursor) {
      break;
    }

    cursor = nextCursor;
  }

  return allOnlineUsers;
};
export { formatChat, generateRandomAvatar, fetchBatchAllOnlineUsersInChat, fetchBatchAllOnlineUsersInUserChat };
