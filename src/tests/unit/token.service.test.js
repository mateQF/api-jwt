import {
  blacklistToken,
  isTokenBlacklisted,
  clearBlacklist,
} from "../../services/token.service.js";

describe("Token Blacklist Service", () => {
  const sampleToken = "test.token.123";

  beforeEach(() => {
    clearBlacklist();
  });

  it("debe devolver false si el token no está en la blacklist", () => {
    expect(isTokenBlacklisted(sampleToken)).toBe(false);
  });

  it("debe devolver true si el token fue revocado", () => {
    blacklistToken(sampleToken);
    expect(isTokenBlacklisted(sampleToken)).toBe(true);
  });

  it("debe limpiar correctamente la blacklist", () => {
    blacklistToken(sampleToken);
    clearBlacklist();
    expect(isTokenBlacklisted(sampleToken)).toBe(false);
  });
});
