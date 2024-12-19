import express from "express";
import * as userController from "./user.controllers";
import upload from "../../config/multer.config";
import { authMiddleware, rolesMiddleware } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";
const router = express.Router();
// User Routes
router.post("/register", upload.single("avatar"), userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/update", authMiddleware, upload.single("avatar"), userController.updateUser);
router.delete("/delete", authMiddleware, userController.deleteUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);
// Admin Routes
router.get(
  "/get-users",
  authMiddleware,
  rolesMiddleware([Role.ADMIN]),
  userController.getUsers
);
router.delete(
  "/delete-users",
  authMiddleware,
  rolesMiddleware([Role.ADMIN]),
  userController.deleteUsers
);
export default router;
