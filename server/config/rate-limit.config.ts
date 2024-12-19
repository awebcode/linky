import { rateLimit } from "express-rate-limit";
import { formatRetryTime } from "../libs/utils";
import { AppError } from "../middlewares/errors-handle.middleware";

export const rateLimitConfig = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 10 requests per windowMs
  standardHeaders: "draft-7", // Use `RateLimit` header for the rate limit details
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res, next) => {
    const retryAfter = res.get("Retry-After"); // Gets the Retry-After header

    // If `Retry-After` header is not present or invalid, default message
    const formattedTime = retryAfter
      ? formatRetryTime(parseInt(retryAfter))
      : "a few seconds";

    // Pass the error to the global error handler using AppError
    next(
      new AppError(`Too many requests. Please try again after ${formattedTime}.`, 429)
    );
  },
});
