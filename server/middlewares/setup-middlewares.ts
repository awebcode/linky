// middlewares/setupMiddleware.ts
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { loggerInstance } from "../config/logger.config";
import config from "../config/index.config";

/**
 * Set up necessary middlewares
 * @param app Express app instance
 */
const setupMiddlewares = (app: express.Application) => {
  // Serving static files
  app.use(express.static("public"));

  // Parsing middleware
  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  // CORS setup
  app.use(cors(config.corsOptions));

  // Cookie parser middleware
  app.use(cookieParser());

  // Helmet for security
  app.use(config.helmet());

  // Logging middleware morgan & winston
  app.use(
    morgan("dev", {
      stream: {
        write: (message) => loggerInstance.info(message.trim()),
      },
    })
  );

  // Apply rate limiting
  app.use(config.rateLimit);
};

export { setupMiddlewares };
