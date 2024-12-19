import express from "express";
import UserRoutes from "./user/user.routes";
import ChatRoutes from "./chat/chat.routes";
import MessageRoutes from "./message/message.routes";
const mainRoutes = express.Router();
mainRoutes.get("/", (req, res) => {
  res.json({ message: "Chat Server is running!" });
});
mainRoutes.use("/user", UserRoutes);
mainRoutes.use("/chat", ChatRoutes);
mainRoutes.use("/message", MessageRoutes);

export default mainRoutes;
