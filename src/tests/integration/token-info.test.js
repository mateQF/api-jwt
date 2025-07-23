import request from "supertest";
import app from "../../server.js";
import { blacklistToken } from "../../services/token.service.js";

describe("Token Info Endpoint", () => {
  let token;

  beforeAll(async () => {
    const user = { username: "infoUser", password: "123456" };
    await request(app).post("/api/auth/register").send(user);
    const res = await request(app).post("/api/auth/login").send(user);
    token = res.body.token;
  });

  it("debe devolver la información del token si es válido", async () => {
    const res = await request(app)
      .get("/api/auth/token-info")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("infoUser");
  });

  it("debe fallar si no se envía el token", async () => {
    const res = await request(app).get("/api/auth/token-info");
    expect(res.statusCode).toBe(401);
  });

  it("debe fallar si el token es inválido", async () => {
    const res = await request(app)
      .get("/api/auth/token-info")
      .set("Authorization", "Bearer token.invalido.123");

    expect(res.statusCode).toBe(403);
  });

  it("debe fallar si el token está en la blacklist", async () => {
    await blacklistToken(token);
    const res = await request(app)
      .get("/api/auth/token-info")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Token revoked/i);
  });
});
