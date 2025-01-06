import express from "express";
import * as chatController from "./chat.controllers";
import upload from "../../config/multer.config";
const chatRouter = express.Router();

// Chat Routes (authenticated)
chatRouter.post("/create-chat", upload.single("avatar"), chatController.createChat);
chatRouter
  .get("/get-chats", chatController.getChats)
  .get("/get-online-conversations", chatController.getOnlineConversations)
  .get("/chats-counts", chatController.getChatsCount);
chatRouter.post("/add_user_to_chat", chatController.addUserToChat);
chatRouter.delete("/delete-all-chats", chatController.deleteAllChats);
export default chatRouter;
