import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import multer from "multer";
import apiRoutes from "./routes/apiRoutes.js";
import db from "./db/db.js";
import { isBlockchainConfigured } from "./services/blockchain.js";
import { logger, requestLogger } from "./utils/logger.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5050;

// Behind a proxy (Render/Railway/Nginx) so rate-limit & IPs work correctly.
app.set("trust proxy", 1);

// --- Security & parsing ---
app.use(helmet());

// CORS allowlist: comma-separated CLIENT_URL(s). Permissive only when unset (dev).
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(requestLogger);

// Global, lenient rate limit (auth/report routes add stricter limits).
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --- Routes ---
app.use("/api", apiRoutes);

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// --- Centralized error handler ---
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large. Maximum size is 10 MB."
        : "File upload error.";
    return res.status(400).json({ error: message });
  }
  if (err.message === "Only JPEG, PNG, and PDF files are allowed") {
    return res.status(400).json({ error: err.message });
  }
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "Origin not allowed." });
  }

  logger.error("Unhandled error", { error: err.message });
  res.status(500).json({ error: "Internal server error." });
});

async function start() {
  await db.checkConnection();
  if (!isBlockchainConfigured()) {
    logger.warn(
      "Blockchain not configured — report endpoints return 503 until RPC_URL, PRIVATE_KEY and CONTRACT_ADDRESS are set."
    );
  }
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`, {
      env: process.env.NODE_ENV || "development",
    });
  });
}

start();

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", { reason: String(reason) });
});

export default app;
