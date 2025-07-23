import fs from "fs";
import { logAction } from "../../../utils/audit.util.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("Logger Utility", () => {
  const logPath = path.resolve(__dirname, "../../../../audit.log");

  const mockReq = {
    ip: "192.168.1.1",
    originalUrl: "/api/test",
    headers: {
      "user-agent": "jest-test-agent",
    },
  };

  beforeEach(() => {
    if (fs.existsSync(logPath)) {
      fs.unlinkSync(logPath);
    }
  });

  it("debe escribir un mensaje en el archivo de log", () => {
    logAction(mockReq, "testuser", "Probando log");

    const content = fs.readFileSync(logPath, "utf-8");
    expect(content).toContain("Probando log");
    expect(content).toContain("testuser");
  });

  it("debe incluir una marca de tiempo y user-agent", () => {
    logAction(mockReq, "admin", "Acceso");

    const content = fs.readFileSync(logPath, "utf-8");
    expect(content).toMatch(/\[\d{4}-\d{2}-\d{2}T.*\]/); // timestamp
    expect(content).toContain("UA: jest-test-agent");
  });
});
