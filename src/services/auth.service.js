import bcrypt from "bcrypt";
import { users } from "../models/user.model.js";
import { generateToken } from "../utils/jwt.util.js";

export const registerUser = async (username, password) => {
  const exists = users.find((u) => u.username === username);
  if (exists) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });

  return { username };
};

export const loginUser = async (username, password) => {
  const user = users.find((u) => u.username === username);
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = generateToken({ username: user.username });
  return token;
};
