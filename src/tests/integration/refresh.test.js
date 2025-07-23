import request from "supertest";
import app from "../../server.js";
import { blacklistToken } from "../../services/token.service.js";

describe("Refresh Token Endpoint", () => {
  let refreshToken;

  beforeAll(async () => {
    const user = { username: "refreshuser", password: "123456" };
    await request(app).post("/api/auth/register").send(user);
    const res = await request(app).post("/api/auth/login").send(user);
    refreshToken = res.body.token;
  });

  it("debe devolver un nuevo token si el refresh token es válido", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Authorization", `Bearer ${refreshToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("debe fallar si no se envía el token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Authorization", "");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Token required/i);
  });

  it("debe fallar si el token es inválido", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Authorization", "Bearer invalid_token");

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBeDefined();
  });

  it("debe fallar si el token está en la blacklist", async () => {
    await blacklistToken(refreshToken); // logout

    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Authorization", `Bearer ${refreshToken}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Token revoked/i);
  });
});
