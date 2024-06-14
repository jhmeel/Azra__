import logger from "../utils/logger.js";

class ErrorHandler extends Error {
  statusCode: number;
  
  constructor(
    statusCode: number,
    message: string,
    description: string = `Error "${statusCode}". "${message}"`,
    internalLog?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    logger.error(description);
    if (internalLog) {
      logger.error(internalLog);
    }
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
