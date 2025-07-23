import { blacklistedTokens } from "../models/tokenBlacklist.model.js";

export const blacklistToken = (token) => {
  blacklistedTokens.push(token);
};

export const isTokenBlacklisted = (token) => {
  return blacklistedTokens.includes(token);
};

export const clearBlacklist = () => {
  blacklistedTokens.splice(0, blacklistedTokens.length);
};
