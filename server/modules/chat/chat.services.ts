// services/chatService.ts

import prisma from "../../libs/prisma";

interface CreateChat {
  name: string;
  adminId: string;
}

const createChat = async ({ name, adminId }: CreateChat) => {
  return await prisma.chat.create({
    data: {
      name,
      adminId,
    },
  });
};

const addUserToChat = async (id: string, chatId: string) => {
  return await prisma.chatMember.create({
    data: {
      id,
      chatId,
    },
  });
};

const getChats = async (id: string) => {
  return await prisma.chatMember.findMany({
    where: { id },
    include: { chat: true },
  });
};

export { createChat, addUserToChat, getChats };
