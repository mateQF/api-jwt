import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import { config } from "./config/config.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

const logStream = fs.createWriteStream(path.resolve("logs/access.log"), {
  flags: "a",
});

app.use(morgan("combined", { stream: logStream }));
app.use(morgan("dev"));
app.use(cors(config.cors));
app.use(helmet(config.security?.helmet || {}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("<h1>API JWT</h1>");
});
app.use("/api/auth", authRoutes);
app.use(errorHandler);

export default app;
