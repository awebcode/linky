// controllers/messageController.ts
import type { RequestHandler } from "express";
import * as messageService from "./message.services";
import { CreateMessageSchema } from "./message.dtos";
import { AppError } from "../../middlewares/errors-handle.middleware";

const sendMessage: RequestHandler = async (req, res, next) => {
  try {
    const message = await messageService.createMessage(req);
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

const getMessages: RequestHandler = async (req, res, next) => {
  try {
    const messages = await messageService.getMessages(req);
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

const markMessageAsSeen: RequestHandler = async (req, res, next) => {
  try {
    await messageService.markMessageAsSeen(req);
    res.status(200).json({ message: "Message marked as seen" });
  } catch (err) {
    next(err);
  }
};

export { sendMessage, getMessages, markMessageAsSeen };
