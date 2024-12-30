// controllers/chat.controllers.ts
import type { RequestHandler } from "express";
import * as chatService from "./chat.services";

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

const getOnlineUsers: RequestHandler = async (req, res, next) => {
  try {
    const onlineUsers = await chatService.getOnlineUsers(req.user.id);
    res.status(200).json(onlineUsers);
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

export { createChat, addUserToChat, getChats,getOnlineUsers, deleteAllChats };
