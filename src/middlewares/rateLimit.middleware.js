import rateLimit from "express-rate-limit";
import { config } from "../config/config.js";

const baseOptions = {
  windowMs: config.rateLimit.windowMs,
  message: config.rateLimit.message,
  standardHeaders: config.rateLimit.standardHeaders,
  legacyHeaders: config.rateLimit.legacyHeaders,
};

export const loginLimiter = rateLimit({
  ...baseOptions,
  max: config.rateLimit.loginMax,
});
export const registerLimiter = rateLimit({
  ...baseOptions,
  max: config.rateLimit.registerMax,
});
export const logoutLimiter = rateLimit({
  ...baseOptions,
  max: config.rateLimit.logoutMax,
});
export const refreshLimiter = rateLimit({
  ...baseOptions,
  max: config.rateLimit.refreshMax,
});
