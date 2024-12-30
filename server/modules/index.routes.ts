import express from "express";
import UserRoutes from "./user/user.routes";
import ChatRoutes from "./chat/chat.routes";
import MessageRoutes from "./message/message.routes";
import uploadRoutes from "./upload/upload.routes";
const mainRoutes = express.Router();
mainRoutes.get("/", (req, res) => {
  res.json({ message: "Chat Server is running!" });
});
mainRoutes.use("/auth", UserRoutes);
mainRoutes.use("/chat", ChatRoutes);
mainRoutes.use("/message", MessageRoutes);
mainRoutes.use("/upload", uploadRoutes);

export default mainRoutes;
