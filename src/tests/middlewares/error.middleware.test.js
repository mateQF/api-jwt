import request from "supertest";
import express from "express";
import { errorHandler } from "../../middlewares/error.middleware.js";

const app = express();

app.get("/test-error", (req, res, next) => {
  const error = new Error("Test error");
  error.status = 418;
  next(error);
});

app.get("/test-500", (req, res, next) => {
  const error = new Error("");
  next(error);
});

app.get("/test-default", (req, res, next) => {
  const error = new Error("");
  next(error);
});

app.use(errorHandler);

describe("Middleware de manejo de errores", () => {
  it("debe manejar errores personalizados y devolver el status correspondiente", async () => {
    const res = await request(app).get("/test-error");

    expect(res.statusCode).toBe(418);
    expect(res.body.error).toBe("Test error");
  });

  it("debe manejar errores sin status definido devolviendo 500", async () => {
    const res = await request(app).get("/test-500");
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Internal Server Error");
  });

  it("debe manejar errores sin mensaje devolviendo mensaje por defecto", async () => {
    const res = await request(app).get("/test-default");
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Internal Server Error");
  });
});
