import express from "express";
import cors from "cors";
import multer from "multer";
import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { createHelia } from "helia";
import { strings } from "@helia/strings";
import { CID } from "multiformats/cid";
import { createRequire } from "module";
import pg from "pg";

// --- NEW IMPORTS FOR AUTH ---
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// --- CONFIG ---
const JWT_SECRET = process.env.JWT_SECRET || "change_this_to_a_super_secret_key_12345";

// ------------------ PostgreSQL Client ------------------
export const db = new pg.Client({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
  database: process.env.PGNAME,
});

async function initDb() {
  await db.connect();
  console.log("📌 PostgreSQL connected");

  // Create tables if they don't exist
  const createUsers = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createDocuments = `
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE SET NULL,
      original_filename VARCHAR(255),
      file_path TEXT NOT NULL,
      extracted_text TEXT,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createHistory = `
    CREATE TABLE IF NOT EXISTS history (
      id SERIAL PRIMARY KEY,
      user_id INT,
      input_type VARCHAR(20) NOT NULL,
      input_value TEXT NOT NULL,
      result VARCHAR(200) NOT NULL,
      confidence_score FLOAT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      metadata JSONB
    );
  `;

  const addForeignKey = `
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_history'
      ) THEN
        ALTER TABLE history
        ADD CONSTRAINT fk_user_history
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL;
      END IF;
    EXCEPTION WHEN undefined_table THEN
      -- ignored
    END;
    $$;
  `;

  await db.query(createUsers);
  await db.query(createDocuments);
  await db.query(createHistory);
  try { await db.query(addForeignKey); } catch (e) { /* noop */ }

  console.log("✅ DB Initialized (tables ensured)");
}

// ------------------ Helpers ------------------
const removeInvisible = (str) => str.replace(/[\u200B-\u200D\uFEFF]/g, "");
const normalizePunctuation = (str) => str.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, "-").replace(/\u00A0/g, " ");
const normalizeUnitsInline = (str) => str.replace(/\bmg\s*per\s*dl\b/gi, "mg/dl").replace(/\bmg\s*dl\b/gi, "mg/dl");

function canonicalizeText(raw) {
  if (!raw) return "";
  let text = raw.normalize("NFKC");
  text = removeInvisible(text);
  text = normalizePunctuation(text);
  text = text.replace(/\r/g, "\n").replace(/-\n/g, "");
  text = text.replace(/[ \t]+/g, " ").replace(/\n{2,}/g, "\n");
  text = normalizeUnitsInline(text);
  return text.trim();
}

function splitSections(text) {
  return [{ name: "full", content: text }];
}

function sha256Hex(text) {
  const h = crypto.createHash("sha256");
  h.update(Buffer.from(text, "utf8"));
  return "0x" + h.digest("hex");
}

function cidToBytes(cidStr) {
  const c = CID.parse(cidStr).toV1();
  return Buffer.from(c.bytes);
}

function encryptText(text) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.scryptSync(String(process.env.ENCRYPTION_KEY), salt, 32);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { alg: "AES-256-GCM", salt: salt.toString("base64"), iv: iv.toString("base64"), tag: tag.toString("base64"), data: enc.toString("base64") };
}

// ------------------ ML Prediction Stub ------------------
async function predictDisease(text) {
  const t = text.toLowerCase();
  const res = { disease: "unknown", confidence: 0.0, metadata: {} };

  if (/blood sugar|glucose|mg\/dl|diabetes|hyperglycemia/.test(t)) {
    res.disease = "Diabetes";
    res.confidence = 0.88;
    res.metadata = { reason: "keywords: glucose / mg/dl" };
  } else if (/fever|cough|respiratory|pneumonia/.test(t)) {
    res.disease = "Respiratory Infection";
    res.confidence = 0.72;
    res.metadata = { reason: "keywords: fever/cough" };
  } else if (/tumor|malignant|carcinoma|biopsy/.test(t)) {
    res.disease = "Possible Malignancy";
    res.confidence = 0.78;
    res.metadata = { reason: "oncology related keywords" };
  } else {
    res.disease = "No strong prediction";
    res.confidence = 0.35;
    res.metadata = { reason: "no high-confidence keywords found" };
  }

  return res;
}

// ------------------ Main Async Init ------------------
(async () => {
  // Check env
  const requiredEnv = ["RPC_URL", "PRIVATE_KEY", "CONTRACT_ADDRESS", "ENCRYPTION_KEY", "PGUSER", "PGPASSWORD", "PGNAME"];
  for (const k of requiredEnv) {
    if (!process.env[k]) {
      console.error(`Missing env var: ${k}`);
      process.exit(1);
    }
  }

  // Init DB
  try {
    await initDb();
  } catch (err) {
    console.error("DB init failed:", err);
    process.exit(1);
  }

  // Helia (IPFS-like) init
  const helia = await createHelia();
  const s = strings(helia);

  // Ethers
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Load contract ABI
  const contractJSON = JSON.parse(
    fs.readFileSync(
      new URL("./medchain-smart-contracts/artifacts/contracts/medical.sol/ReportValidator.json", import.meta.url),
      "utf-8"
    )
  );

  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractJSON.abi, wallet);

  console.log("Contract address:", process.env.CONTRACT_ADDRESS);
  console.log("Backend wallet address:", await wallet.getAddress());

  // Express setup
  const app = express();
  const port = 3000;

  app.use(helmet());
  app.use(cors()); // Configure this for production later
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Multer
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const okType = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.mimetype);
      cb(okType ? null : new Error("Only .pdf and .docx"), okType);
    },
  });

  // Rate limiter
  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 40 });
  app.use(limiter);

  // ==========================================
  // AUTHENTICATION ROUTES (NEW)
  // ==========================================

  // 1. REGISTER
  app.post("/auth/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    try {
      // Check if user exists
      const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (userCheck.rows.length > 0) {
        return res.status(400).json({ error: "User already exists with this email" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Insert user
      const result = await db.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
        [username, email, passwordHash]
      );

      res.status(201).json({ 
        message: "User registered successfully", 
        user: result.rows[0] 
      });

    } catch (err) {
      console.error("Register Error:", err);
      res.status(500).json({ error: "Server error during registration" });
    }
  });

  // 2. LOGIN
  app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      // Find user
      const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = result.rows[0];

      // Compare password
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate Token
      const token = jwt.sign(
        { userId: user.id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });

    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ error: "Server error during login" });
    }
  });

  // ==========================================
  // EXISTING ROUTES
  // ==========================================

  app.get("/health", (_, res) => res.status(200).send("ok"));

  app.post("/upload", upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      let subject = req.body.subject;
      if (!file) return res.status(400).json({ error: "No file uploaded" });
      if (!subject) return res.status(400).json({ error: "Subject is required" });

      try { subject = ethers.getAddress(subject); } catch { return res.status(400).json({ error: "Valid subject address required" }); }

      let rawText = "";
      const ext = path.extname(file.originalname).toLowerCase();

      if (ext === ".pdf") {
        const pdfData = await pdfParse(file.buffer);
        rawText = (pdfData.text || "").replace(/-\n/g, "");
      } else if (ext === ".docx") {
        const tmp = `/tmp/${Date.now()}_${path.basename(file.originalname)}`;
        await fs.promises.writeFile(tmp, file.buffer);
        try {
          rawText = (await mammoth.extractRawText({ path: tmp })).value || "";
        } finally { try { await fs.promises.unlink(tmp); } catch {} }
      } else return res.status(400).json({ error: "Unsupported file type" });

      const normalized = canonicalizeText(rawText);
      const sections = splitSections(normalized);
      const contentHash = sha256Hex(normalized);
      const encryptedPayload = JSON.stringify(encryptText(normalized));

      // store encrypted text in helia (IPFS-like)
      const textCID = await s.addString(encryptedPayload);
      const cidBytes = cidToBytes(textCID.toString());

      // Save document to DB
      const docInsertQuery = `
        INSERT INTO documents (user_id, original_filename, file_path, extracted_text)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `;
      const docValues = [
        req.body.user_id ? Number(req.body.user_id) : null,
        file.originalname,
        "ipfs://" + textCID.toString(),
        normalized
      ];
      const docResult = await db.query(docInsertQuery, docValues);
      const documentId = docResult.rows[0].id;

      // Check on-chain role
      const UPLOADER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("UPLOADER_ROLE"));
      const hasRole = await contract.hasRole(UPLOADER_ROLE, await wallet.getAddress());
      if (!hasRole) return res.status(403).json({ error: "Backend wallet missing UPLOADER_ROLE" });

      // ML prediction (stub)
      const mlResult = await predictDisease(normalized);

      // Save history
      const historyInsertQuery = `
        INSERT INTO history (user_id, input_type, input_value, result, confidence_score, metadata)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `;
      const historyValues = [
        req.body.user_id ? Number(req.body.user_id) : null,
        ext === ".pdf" ? "pdf" : "docx",
        textCID.toString(),
        mlResult.disease,
        mlResult.confidence,
        JSON.stringify(mlResult.metadata || {})
      ];
      const historyRes = await db.query(historyInsertQuery, historyValues);
      const historyId = historyRes.rows[0].id;

      // Upload on-chain
      const tx = await contract.uploadReport(subject, contentHash, cidBytes);
      const receipt = await tx.wait();

      res.json({
        subject,
        hash: contentHash,
        textCID: textCID.toString(),
        sections: sections.map((s) => s.name),
        documentId,
        historyId,
        prediction: mlResult,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      });

    } catch (err) {
      console.error(err.stack || err);
      const msg = (err?.error?.message || err?.message || "").includes("missing role")
        ? "On-chain role missing: grant UPLOADER_ROLE"
        : "Server error";
      res.status(500).json({ error: msg });
    }
  });

  // simple root
  app.get("/", (req, res) => res.send("Backend is running ✅"));

  const server = app.listen(port, () => console.log(`API listening on http://localhost:${port}`));

  // graceful shutdown
  async function shutdown() {
    console.log("Shutting down...");
    await new Promise((resolve) => server.close(resolve));
    try { await helia.stop(); } catch (e) {}
    try { await db.end(); } catch (e) {}
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

})();

export { predictDisease };