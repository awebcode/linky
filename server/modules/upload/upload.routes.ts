import express from "express";
import upload from "../../config/multer.config";
import * as uploadServices from "./upload.services";
import { authMiddleware } from "../../middlewares/auth.middleware";
const uploadRoutes = express.Router();

// Upload routes
uploadRoutes.use(authMiddleware)
uploadRoutes.post("/single", upload.single("file"), uploadServices.uploadFile);
uploadRoutes.post("/multiple", upload.array("files"), uploadServices.uploadFiles);
uploadRoutes.delete("/delete-file", uploadServices.deleteSingleFile);

export default uploadRoutes;
