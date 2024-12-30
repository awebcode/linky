import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as chatController from "./chat.controllers";
import upload from "../../config/multer.config";
const chatRouter = express.Router();

// Chat Routes (authenticated)
chatRouter.use(authMiddleware);
chatRouter.post("/create-chat", upload.single("avatar"), chatController.createChat);
chatRouter
  .get("/get-chats", chatController.getChats)
  .get("/get-online-users", chatController.getOnlineUsers);
chatRouter.post("/add_user_to_chat", chatController.addUserToChat);
chatRouter.delete("/delete-all-chats", chatController.deleteAllChats);
export default chatRouter;
