import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { generateToken } from "../../utils/jwt.util.js";
import { blacklistToken } from "../../services/token.service.js";
import { jest } from '@jest/globals';
import dotenv from 'dotenv';
dotenv.config();

describe("Middleware: authenticateToken", () => {
  const mockUser = { username: "testuser" };
  const validToken = generateToken(mockUser);
  const invalidToken = "invalid.token.value";

  const next = jest.fn();
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  beforeEach(() => {
    next.mockClear();
    res.status.mockClear();
    res.json.mockClear();
  });

  it("debe devolver 401 si no se envía token", () => {
    const req = { headers: {} };
    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("debe devolver 403 si el token es inválido", () => {
    const req = {
      headers: {
        authorization: `Bearer ${invalidToken}`,
      },
    };
    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("debe llamar next() si el token es válido", () => {
    const req = {
      headers: {
        authorization: `Bearer ${validToken}`,
      },
    };
    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.username).toBe("testuser");
  });

  it("debe devolver 401 si el token está en blacklist", () => {
    const req = {
      headers: {
        authorization: `Bearer ${validToken}`,
      },
    };

    blacklistToken(validToken); // lo revocamos

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token revoked" });
    expect(next).not.toHaveBeenCalled();
  });
});
