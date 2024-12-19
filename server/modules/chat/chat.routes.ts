import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as chatController from "./chat.controllers";
const chatRouter = express.Router();

// Chat Routes (authenticated)
chatRouter.use(authMiddleware);
chatRouter.post("/chat", chatController.createChat);
chatRouter.get("/chats", chatController.getChats);
chatRouter.post("/add_user_to_chat", chatController.addUserToChat);

export default chatRouter;
