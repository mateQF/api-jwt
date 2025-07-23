import { verifyToken } from "../utils/jwt.util.js";
import { isTokenBlacklisted } from "../services/token.service.js";
import { body, validationResult } from "express-validator";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token required" });

  if (isTokenBlacklisted(token)) {
    return res.status(401).json({ error: "Token revoked" });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const validateRegister = [
  body("username").isString().notEmpty(),
  body("password").isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];
