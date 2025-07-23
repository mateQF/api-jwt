import { config } from "../../config/config.js";

describe("Configuración de la aplicación", () => {
  it("debe tener las propiedades principales", () => {
    expect(config).toHaveProperty("port");
    expect(config).toHaveProperty("jwtSecret");
    expect(config).toHaveProperty("jwtExpiresIn");
    expect(config).toHaveProperty("rateLimit");
    expect(config).toHaveProperty("cors");
  });

  it("debe tener valores por defecto si no hay variables .env", () => {
    expect(config.port).toBeDefined();
    expect(config.jwtSecret).toBeDefined();
    expect(config.jwtExpiresIn).toBeDefined();
  });

  it("debe tener una configuración de CORS válida", () => {
    expect(config.cors).toHaveProperty("origin");
    expect(config.cors).toHaveProperty("methods");
    expect(config.cors).toHaveProperty("credentials");
    expect(Array.isArray(config.cors.origin)).toBe(true);
  });

  it("debe tener una configuración de rate limit válida", () => {
    expect(config.rateLimit).toHaveProperty("windowMs");
    expect(config.rateLimit).toHaveProperty("loginMax");
    expect(config.rateLimit).toHaveProperty("registerMax");
    expect(typeof config.rateLimit.windowMs).toBe("number");
  });
});
