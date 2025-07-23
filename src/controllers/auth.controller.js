import { registerUser, loginUser } from "../services/auth.service.js";
import { blacklistToken } from "../services/token.service.js";
import { generateToken, verifyToken } from "../utils/jwt.util.js";
import { logger } from "../utils/logger.util.js";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await registerUser(username, password);
    logger.info(`Nuevo usuario registrado: ${username}`);
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    logger.error(`Error al registrar usuario: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await loginUser(username, password);
    logger.info(`Usuario logueado correctamente: ${username}`);
    res.json({ message: "Login successful", token });
  } catch (err) {
    logger.warn(`Intento de login fallido: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    logger.warn("Logout fallido: Token no enviado");
    return res.status(401).json({ message: "Token required" });
  }
  blacklistToken(token);
  logger.info("Usuario deslogueado con éxito");
  res.json({ message: "Session closed" });
};

export const refresh = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const payload = verifyToken(token);
    const newToken = generateToken({ username: payload.username });
    logger.info(`Refresh token generado para: ${payload.username}`);
    res.json({ token: newToken });
  } catch {
    logger.warn("Refresh token inválido");
    res.status(401).json({ error: "Invalid token" });
  }
};

export const tokenInfo = (req, res) => {
  const exp = req.user.exp;
  const now = Math.floor(Date.now() / 1000);
  const secondsLeft = exp - now;

  logger.info(`Info de token solicitada por: ${req.user.username}`);
  res.json({
    username: req.user.username,
    expira_en_segundos: secondsLeft,
  });
};

export const protectedData = (req, res) => {
  logger.info(`Ruta protegida accedida por: ${req.user.username}`);
  res.json({
    message: `Hello ${req.user.username}, this is a protected route`,
  });
};
