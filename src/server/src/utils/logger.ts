import winston from "winston";
import Config from "../config/config.js";

const { createLogger, transports } = winston;
const { combine, timestamp, printf } = winston.format;
const { LOG_STORAGE_PATH, MAX_LOG_FILE, MAX_LOG_FILE_SIZE } = Config.LOGGER;

// Log format
const logFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf((info:any) => JSON.stringify({
    timestamp: info.timestamp,
    level: info.level, 
    message: info.message
  }))
);

// Logger with a rotating file transport
const logger = createLogger({
  level: "debug",
  format: logFormat,
  transports: [
    new transports.Console(),
    new transports.File({
      filename: LOG_STORAGE_PATH,
      maxFiles: MAX_LOG_FILE,
      maxsize: MAX_LOG_FILE_SIZE,
    }),
  ],
});

export default logger;
