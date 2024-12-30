import { faker } from "@faker-js/faker";
import type { Message } from "@prisma/client";
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
const fetchLatestMessage = (messages: Message[]) => {
  if (!messages.length) return null;

  const lastMessage = messages[0];
  return lastMessage;
};

/**
 * Format a chat object for response.
 */
const formatChat = (chatMember: any, userId: string) => {
  const { chat } = chatMember;
  const lastMessage = fetchLatestMessage(chat.messages);
  const unreadCount = chat.messages.filter(
    (msg: any) => msg.MessageSeen.length === 0
  ).length;

  const user = chat.members[0]?.user;

  return {
    id: chat.id,
    isGroup: chat.isGroup,
    groupInfo: {
      groupId: chat.id,
      groupName: chat.name,
      groupImage: chat.image,
      timestamp: lastMessage?.sentAt.toISOString() || null,
      createdAt: chat.createdAt.toISOString(),
      // status: chat.status,
    },
    user: {
      id: user?.id || "",
      name: user?.name || "",
      image: user?.image || "",
      status: user?.status,
    },
    lastMessage,
    messages: chat.messages,
    timestamp: lastMessage?.sentAt.toISOString() || null,
    createdAt: chat.createdAt.toISOString(),
    unreadCount,
    membersCount: chat.members.length,
  };
};

export { formatChat, generateRandomAvatar };
