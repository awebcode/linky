import type { Request, Response, NextFunction } from "express";
import { loggerInstance } from "../config/logger.config";
import {
  formatErrorMessage,
  getStatusCode,
} from "../libs/errors.utils";

/**
 * Custom error creator class
 * @extends Error
 * @augments message - Error message
 * @augments statusCode - HTTP status code
 */
export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Error handler middleware
 * @param err
 * @param req
 * @param res
 * @param next
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Format the error message and get status code
  const message = formatErrorMessage(err);
  const statusCode = getStatusCode(err);

  // Log error details
  loggerInstance.error(
    `Error at ${req.method} ${req.originalUrl}: ${message}`, 
    { statusCode }
  );

  // Send error response
  res.status(statusCode).json({
    success: false,
    status: "error",
    statusCode,
    message,
  });
};

// 404
export const NotFoundExceptionMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
};
