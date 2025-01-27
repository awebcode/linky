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
chatRouter.put("/add_user_to_chat", chatController.addUserToChat);
chatRouter.put("/remove_user_from_chat", chatController.removeUserFromChat);
chatRouter.delete("/delete-all-chats", chatController.deleteAllChats);
export default chatRouter;
