import fs from "fs";
import path from "path";

export const logAction = (req, username, action) => {
  const logFile = path.resolve("audit.log");
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  const timestamp = `[${new Date().toISOString()}]`; // 👈 con corchetes
  const logLine = `${timestamp} - [${username}] - ${action} - IP: ${req.ip} - URL: ${req.originalUrl} - UA: ${req.headers["user-agent"]}\n`;

  fs.appendFileSync(logFile, logLine);
};
