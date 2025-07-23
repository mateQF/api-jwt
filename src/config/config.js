import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "secreto_default",
  jwtExpiresIn: process.env.JWT_EXPIRES || "1h",
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    message: "Too much attemps. Try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    loginMax: 10,
    registerMax: 5,
    refreshMax: 15,
    logoutMax: 20,
  },
  cors: {
    origin: ["http://localhost:5173"], //front
    methods: ["GET", "POST"],
    credentials: true,
  },
  security: {
    helmet: {
      contentSecurityPolicy: false, // CSP por compatibilidad
    },
  },
};
