// controllers/chat.controllers.ts
import type { RequestHandler } from "express";
import * as chatService from "./chat.services";
import { getTotalChatCounts } from "./chat.utils";

const createChat: RequestHandler = async (req, res, next) => {
  try {
    const chat = await chatService.createChat(req);
    res.status(201).json(chat);
  } catch (err) {
    next(err);
  }
};

const addUserToChat: RequestHandler = async (req, res, next) => {
  try {
    await chatService.addUserToChat(req);
    res.status(200).json({ message: "User added to chat" });
  } catch (err) {
    next(err);
  }
};

const getChats: RequestHandler = async (req, res, next) => {
  try {
    const chats = await chatService.getChats(req);
    res.status(200).json(chats);
  } catch (err) {
    next(err);
  }
};

const getChatsCount: RequestHandler = async (req, res, next) => {
  try {
    const count = await getTotalChatCounts(req.user.id);
    res.status(200).json(count);
  } catch (err) {
    next(err);
  }
}

const getOnlineConversations: RequestHandler = async (req, res, next) => {
  try {
    const onlineChatMembers = await chatService.getOnlineConversationsForClient(req);
    res.status(200).json(onlineChatMembers);
  } catch (err) {
    next(err);
  }
};

const deleteAllChats: RequestHandler = async (req, res, next) => {
  try {
    const chats = await chatService.deleteAllChats(req);
    res.status(200).json({ message: "All chats deleted successfully", chats });
  } catch (err) {
    next(err);
  }
};

export { createChat, addUserToChat, getChats,getOnlineConversations, deleteAllChats, getChatsCount };
