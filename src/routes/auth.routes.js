import express from "express";
import {
  register,
  login,
  logout,
  protectedData,
  refresh,
  tokenInfo,
} from "../controllers/auth.controller.js";
import { authenticateToken, validateRegister } from "../middlewares/auth.middleware.js";
import { loginLimiter, logoutLimiter, refreshLimiter, registerLimiter } from "../middlewares/rateLimit.middleware.js";
import { audit } from '../middlewares/audit.middleware.js';

const router = express.Router();

router.post("/register", validateRegister, registerLimiter, audit('REGISTER'), register);
router.post("/login", loginLimiter, audit('LOGIN'), login);
router.post("/logout", authenticateToken, logoutLimiter, audit('LOGOUT'), logout);
router.post("/refresh", authenticateToken, refreshLimiter, audit("REFRESH TOKEN"), refresh);
router.get("/token-info", authenticateToken, refreshLimiter, audit("TOKEN INFO"), tokenInfo);
router.get("/protected", authenticateToken, protectedData);

export default router;
