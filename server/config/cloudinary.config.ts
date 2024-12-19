// cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import { envConfig } from "./env.config";
import { AppError } from "../middlewares/errors-handle.middleware";
import type { Request } from "express";
import fs from "fs";
import path from "path";

// Ensure you set your environment variables or hard-code them (not recommended for production)
cloudinary.config({
  cloud_name: envConfig.cloudinaryCloudName,
  api_key: envConfig.cloudinaryApiKey,
  api_secret: envConfig.cloudinaryApiSecret,
  secure: true,
});

// Export the cloudinary instance for use in your application
export default cloudinary;



export const uploadSingleFile = async (req: Request) => {
  if (!req.file) {
    throw new AppError("Please upload an avatar", 400);
  }
  const result = await cloudinary.uploader.upload(req.file?.path as string, {
    folder: "linky",
  });
  fs.unlinkSync(req.file?.path as string);
  return result;
};

export const uploadMultipleFiles = async (req: Request) => {
  if (!req.files || !(req.files as Express.Multer.File[]).length) {
    throw new AppError("Please upload at least one file", 400);
  }

  const uploadedFiles = await Promise.all(
    (req.files as Express.Multer.File[]).map(async (file) => {
      try {
        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "linky", // Optional: Specify a folder in Cloudinary
        });

        // Remove the file from the local storage
        fs.unlinkSync(file.path);

        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      } catch (err) {
        // Clean up local file if an upload fails
        fs.unlinkSync(file.path);
        throw new AppError(`Failed to upload file ${file.originalname}`, 500);
      }
    })
  );

  return uploadedFiles;
};

export const deleteFile = async (secureUrl: string) => {
  try {
    const urlSegments = secureUrl.split("/");
    const fileName = urlSegments[urlSegments.length - 1]; // Get the last segment (e.g., sample.jpg)
    const publicId = urlSegments.slice(-2).join("/").replace(path.extname(fileName), ""); // Remove extension
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    throw new AppError("Failed to delete file", 500);
  }
};