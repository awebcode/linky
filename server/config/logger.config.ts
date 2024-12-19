import { createLogger, format, transports } from "winston";
const { combine, printf, timestamp, colorize, errors } = format;
//* Custom log display format with a simplified timestamp (YYYY-MM-DD HH:MM:SS)
const customFormat = printf(({ timestamp, level, stack, message, label }) => {
  return `[${label ? label + " " : ""}${level.toUpperCase()}] - ${message} ${
    stack || ""
  }  ${timestamp} `;
});

// Configuration options for different transports
const options = {
  file: {
    filename: "logs/error.log",
    level: "error",
  },
  console: {
    level: "silly",
  },
};

// Development logger configuration
const devLogger = createLogger({
  format: combine(
    timestamp({ format: "MM-DD-YY hh:mm A" }), // 12-hour format with AM/PM
    errors({ stack: true }), // Include stack trace for errors
    customFormat, // Apply custom format
    format.align(),
    format.label({ label: "DEV" }), // Add a label to all logs
    format.metadata(), // Capture additional metadata
    colorize({ all: true }) // Apply colorization to all logs
  ),
  transports: [
    new transports.Console(options.console), // Console transport with development settings
    new transports.File(options.file), // File transport for error logs
  ],
});
// for production environment
const prodLogger = {
  format: combine(
    timestamp({ format: "MM-DD-YYYY hh:mm:ss A" }), // 12-hour format with AM/PM
    errors({ stack: true }), // Include stack trace for errors
    customFormat, // Apply custom format
    format.align(),
    colorize({ all: true }) // Apply colorization to all logs
  ),
  transports: [
    new transports.File(options.file),
    new transports.File({
      filename: "logs/combine.log",
      level: "info",
    }),
  ],
};

// export log instance based on the current environment
const instanceLogger = process.env.NODE_ENV === "production" ? prodLogger : devLogger;

export const loggerInstance = createLogger(instanceLogger);
