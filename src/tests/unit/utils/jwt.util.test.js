import { generateToken, verifyToken } from "../../../utils/jwt.util.js";
import dotenv from "dotenv";
dotenv.config();

describe("JWT Utils", () => {
  const payload = { username: "testuser" };

  it("debe generar un token válido con un payload", () => {
    const token = generateToken(payload);
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("debe verificar un token válido y devolver el payload original", () => {
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.username).toBe(payload.username);
  });

  it("debe lanzar error si el token es inválido", () => {
    expect(() => verifyToken("invalid.token.value")).toThrow();
  });

  it("debe lanzar error si el token está vacío", () => {
    expect(() => verifyToken()).toThrow();
  });
});
