import { AppError } from "./../../middlewares/errors-handle.middleware";
import {
  uploadMultipleFiles,
  uploadSingleFile,
  deleteFile,
} from "./../../config/cloudinary.config";
import type { RequestHandler } from "express";

export const uploadFile: RequestHandler = async (req, res, next) => {
  try {
    const result = await uploadSingleFile(req);
    res.status(201).json({ message: "File uploaded successfully", result });
  } catch (err) {
    next(err);
  }
};

export const uploadFiles: RequestHandler = async (req, res, next) => {
    try {
      console.log({files: req.files})
    const results = await uploadMultipleFiles(req);
    res.status(201).json({ message: "Files uploaded successfully", results });
  } catch (err) {
    next(err);
  }
};

export const deleteSingleFile: RequestHandler = async (req, res, next) => {
  try {
    const { secure_url } = req.body;
    if (!secure_url) throw new AppError("Please provide a secure url", 400);
    const result = await deleteFile(secure_url);
    res.status(201).json({ message: "File deleted successfully", result });
  } catch (err) {
    next(err);
  }
};
