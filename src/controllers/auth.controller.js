import { registerUser, loginUser } from "../services/auth.service.js";
import { blacklistToken } from "../services/token.service.js";
import { generateToken, verifyToken } from "../utils/jwt.util.js";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await registerUser(username, password);
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await loginUser(username, password);
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token required" });
  blacklistToken(token);
  res.json({ message: "Session closed" });
};

export const refresh = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const payload = verifyToken(token);
    const newToken = generateToken({ username: payload.username });
    res.json({ token: newToken });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const tokenInfo = (req, res) => {
  const exp = req.user.exp;
  const now = Math.floor(Date.now() / 1000);
  const secondsLeft = exp - now;

  res.json({
    username: req.user.username,
    expira_en_segundos: secondsLeft,
  });
};

export const protectedData = (req, res) => {
  res.json({
    message: `Hello ${req.user.username}, this is a protected route`,
  });
};
