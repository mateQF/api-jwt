import request from "supertest";
import app from "../../server.js";
import { blacklistToken } from "../../services/token.service.js";

describe("Logout Endpoint", () => {
  let token;

  beforeAll(async () => {
    const user = { username: "logoutuser", password: "123456" };
    await request(app).post("/api/auth/register").send(user);
    const res = await request(app).post("/api/auth/login").send(user);
    token = res.body.token;
  });

  it("debe desloguear correctamente con token válido", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Session closed/i);
  });

  it("debe fallar si no se envía token", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.statusCode).toBe(401);
  });

  it("debe fallar si el token ya está en la blacklist", async () => {
    await blacklistToken(token);

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Token revoked/i);
  });
});
