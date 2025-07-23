import request from "supertest";
import app from "../../server.js";

let token;

describe("Registro de usuario", () => {
  const validUser = {
    username: "user1",
    password: "123456",
  };

  it("debe registrar correctamente un nuevo usuario", async () => {
    const res = await request(app).post("/api/auth/register").send(validUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.username).toBe(validUser.username);
  });

  it("no debe permitir registrar el mismo usuario dos veces", async () => {
    const res = await request(app).post("/api/auth/register").send(validUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });

  it("no debe registrar si falta la contraseña", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "user2" });

    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors[0].path).toBe("password");
  });

  it("no debe registrar si falta el nombre de usuario", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ password: "123456" });

    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors[0].path).toBe("username");
  });

  it("no debe registrar si la contraseña es muy corta", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "user3", password: "123" });

    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });
});

describe("Login y autenticación", () => {
  const user = {
    username: "userLogin",
    password: "123456",
  };

  beforeAll(async () => {
    await request(app).post("/api/auth/register").send(user);
  });

  it("debe loguear al usuario correctamente y devolver un token", async () => {
    const res = await request(app).post("/api/auth/login").send(user);

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  it("no debe loguear con contraseña incorrecta", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: user.username, password: "wrongpass" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("no debe loguear con nombre de usuario inexistente", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "nonexistent", password: "123456" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("no debe loguear si falta el username", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "123456" });

    expect(res.statusCode).toBe(400);
  });

  it("no debe loguear si falta la password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: user.username });

    expect(res.statusCode).toBe(400);
  });
});

describe("Rutas protegidas", () => {
  it("debe permitir acceso a la ruta protegida con token válido", async () => {
    const res = await request(app)
      .get("/api/auth/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Hello/i);
  });

  it("no debe permitir acceso sin token", async () => {
    const res = await request(app).get("/api/auth/protected");

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Token required/i);
  });

  it("no debe permitir acceso con token inválido", async () => {
    const res = await request(app)
      .get("/api/auth/protected")
      .set("Authorization", "Bearer invalid.token");

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/invalid/i);
  });
});

describe("Token info y logout", () => {
  it("debe devolver información del token", async () => {
    const res = await request(app)
      .get("/api/auth/token-info")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBeDefined();
    expect(res.body.expira_en_segundos).toBeGreaterThan(0);
  });

  it("debe permitir hacer logout", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/closed/i);
  });

  it("no debe permitir acceder a la ruta protegida con token revocado", async () => {
    const res = await request(app)
      .get("/api/auth/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/revoked/i);
  });
});
