import express from "express";
import rateLimit from "express-rate-limit";
import { reportController } from "../controllers/reportController.js";
import { signup, login } from "../controllers/userController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import db from "../db/db.js";
import { getBlockchainStatus } from "../services/blockchain.js";
import { getMlStatus } from "../services/aiService.js";

const router = express.Router();

// Stricter limiter for auth endpoints to slow credential-stuffing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
});

// --- Health ---
router.get("/health", async (_req, res) => {
  const [database, blockchain, ml] = await Promise.all([
    db.checkConnection(),
    getBlockchainStatus(),
    getMlStatus(),
  ]);
  const healthy = database.connected;
  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    services: { database, blockchain, ml },
    timestamp: new Date().toISOString(),
  });
});

// --- Auth ---
router.post("/auth/signup", authLimiter, signup);
router.post("/auth/login", authLimiter, login);

// --- Reports (protected) ---
// Doctors/admins record reports; anyone signed in can verify or view history.
router.post(
  "/reports/submit",
  protect,
  authorize("doctor", "admin"),
  upload.single("report"),
  reportController.submitMedicalReport
);
router.post(
  "/reports/verify",
  protect,
  upload.single("report"),
  reportController.validateCertificate
);
router.post(
  "/reports/repudiate",
  protect,
  authorize("admin"),
  reportController.repudiateDisease
);
router.get("/reports/history", protect, reportController.getHistory);

export default router;
