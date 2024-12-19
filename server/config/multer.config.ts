import multer, { type FileFilterCallback } from "multer";

// Define storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Ensure the uploads folder exists
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

// Define file filter with correct typing
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/svg+xml"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("File type not allowed") as any, false); // Reject the file with an error
  }
};

// Create the multer upload instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 }, // Limit for every  file size to 50MB
  fileFilter: fileFilter,
});

export default upload;
