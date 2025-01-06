import express from "express";
import * as messageController from "./message.controllers";
import { authMiddleware } from "../../middlewares/auth.middleware";
// import upload from "../../config/multer.config";
const messageRouter = express.Router();

// Message Routes (authenticated)
messageRouter.use(authMiddleware); //upload.array("files"), if needed
messageRouter.post("/send-message", messageController.sendMessage);
messageRouter.get("/get-messages/:chatId", messageController.getMessages);
messageRouter.post("/messages/seen/:messageId", messageController.markMessageAsSeen);

export default messageRouter;
