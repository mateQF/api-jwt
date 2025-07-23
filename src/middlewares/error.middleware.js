import { logger } from "../utils/logger.util.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: message });
  next();
};
