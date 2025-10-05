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

dotenv.config();
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// --- Load contract ABI ---
const contractJSON = JSON.parse(
  fs.readFileSync(
    new URL("./medchain-smart-contracts/artifacts/contracts/medical.sol/ReportValidator.json", import.meta.url),
    "utf-8"
  )
);
console.log("ABI loaded:", contractJSON.abi);

// --- ENV check ---
const requiredEnv = ["RPC_URL", "PRIVATE_KEY", "CONTRACT_ADDRESS", "ENCRYPTION_KEY"];
for (const k of requiredEnv) {
  if (!process.env[k]) {
    console.error(`Missing env var: ${k}`);
    process.exit(1);
  }
}

// --- Express setup ---
const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Multer error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) return res.status(400).json({ error: err.message });
  next(err);
});

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use(limiter);

// --- Helpers ---
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
  return text.trim().toLowerCase();
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

// --- Async init ---
(async () => {
  const helia = await createHelia();
  const s = strings(helia);

  // --- Ethers ---
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractJSON.abi, wallet);

  console.log("Contract address:", process.env.CONTRACT_ADDRESS);
  console.log("Backend wallet address:", await wallet.getAddress());

  // --- Multer ---
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const okType = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.mimetype);
      cb(okType ? null : new Error("Only .pdf and .docx"), okType);
    },
  });

  // --- Routes ---
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
      const textCID = await s.addString(encryptedPayload);
      const cidBytes = cidToBytes(textCID.toString());

      const UPLOADER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("UPLOADER_ROLE"));
      const hasRole = await contract.hasRole(UPLOADER_ROLE, await wallet.getAddress());
      if (!hasRole) return res.status(403).json({ error: "Backend wallet missing UPLOADER_ROLE" });

      const tx = await contract.uploadReport(subject, contentHash, cidBytes);
      const receipt = await tx.wait();

      res.json({
        subject,
        hash: contentHash,
        textCID: textCID.toString(),
        sections: sections.map((s) => s.name),
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
      });
    } catch (err) {
      console.error(err.stack);
      const msg = (err?.error?.message || err?.message || "").includes("missing role")
        ? "On-chain role missing: grant UPLOADER_ROLE"
        : "Server error";
      res.status(500).json({ error: msg });
    }
  });

  // --- Start server ---
  const server = app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
  app.get("/", (req, res) => res.send("Backend is running ✅"));

  // --- Graceful shutdown ---
  async function shutdown() {
    console.log("Shutting down...");
    await new Promise((resolve) => server.close(resolve));
    await helia.stop();
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
})();
