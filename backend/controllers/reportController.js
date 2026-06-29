import { ethers } from "ethers";
import {
  getMedicalContract,
  isBlockchainConfigured,
} from "../services/blockchain.js";
import { uploadToIPFS, calculateFileHash } from "../services/ipfs.js";
import { analyzeXray } from "../services/aiService.js";
import reportService from "../services/reportService.js";
import { logger } from "../utils/logger.js";

function requireChain(res) {
  if (!isBlockchainConfigured()) {
    res.status(503).json({
      success: false,
      error:
        "Blockchain service is not configured on the server. Please try again later.",
    });
    return false;
  }
  return true;
}

export const reportController = {
  /**
   * Submit a new medical report:
   * hash file -> run ML analysis -> pin to IPFS -> write hash on-chain -> index in DB.
   */
  submitMedicalReport: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No report file provided." });
      }

      const { patientAddress } = req.body;
      if (!patientAddress || !ethers.isAddress(patientAddress)) {
        return res
          .status(400)
          .json({ error: "A valid patient Ethereum address is required." });
      }

      if (!requireChain(res)) return;

      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname;

      // A. Deterministic content fingerprint (bytes32) used for on-chain proof.
      const contentHash = calculateFileHash(fileBuffer);

      // B. Best-effort ML analysis — failures must not block the submission.
      let mlPrediction = "Unknown";
      let mlConfidence = 0;
      try {
        const analysis = await analyzeXray(fileBuffer);
        mlPrediction = analysis.condition || analysis.disease || "Unknown";
        mlConfidence = Number(analysis.confidence) || 0;
      } catch (err) {
        logger.warn("ML analysis unavailable, continuing", { error: err.message });
      }

      // C. Pin the file to IPFS.
      let ipfsHash = null;
      try {
        ipfsHash = await uploadToIPFS(fileBuffer, fileName);
      } catch (err) {
        logger.error("IPFS upload failed", { error: err.message });
        return res
          .status(502)
          .json({ error: "Could not store the document on IPFS. Please try again." });
      }

      // D. Write the proof on-chain.
      const contract = getMedicalContract();
      const cidBytes = ethers.toUtf8Bytes(ipfsHash);
      const tx = await contract.uploadReport(patientAddress, contentHash, cidBytes);
      const receipt = await tx.wait();

      // E. Index in the DB (non-blocking on failure).
      await reportService.record({
        userId: req.user?.id ?? null,
        patientAddress,
        fileName,
        contentHash,
        ipfsCid: ipfsHash,
        txHash: receipt.hash,
        mlPrediction,
        mlConfidence,
        action: "submit",
        status: "recorded",
      });

      logger.info("Report submitted on-chain", {
        patientAddress,
        txHash: receipt.hash,
      });

      return res.status(201).json({
        success: true,
        message: "Medical report recorded successfully",
        data: {
          transactionHash: receipt.hash,
          ipfsHash,
          contentHash,
          mlPrediction,
          mlConfidence,
        },
      });
    } catch (error) {
      logger.error("Submission error", { error: error.message });
      return res.status(500).json({
        success: false,
        error: error.reason || "Failed to submit report. Please try again.",
      });
    }
  },

  /**
   * Verify an uploaded document against the latest on-chain record for an address.
   */
  validateCertificate: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Please upload the document to verify." });
      }

      const { patientAddress } = req.body;
      if (!patientAddress || !ethers.isAddress(patientAddress)) {
        return res
          .status(400)
          .json({ error: "A valid patient Ethereum address is required." });
      }

      if (!requireChain(res)) return;

      const calculatedHash = calculateFileHash(req.file.buffer);
      const contract = getMedicalContract();

      let storedReport;
      try {
        storedReport = await contract.getLatestReport(patientAddress);
      } catch {
        return res.status(404).json({
          valid: false,
          message: "No reports found for this address on the blockchain.",
        });
      }

      const [storedHash, , timestamp, isRepudiated] = storedReport;
      const hashMatches = storedHash === calculatedHash;

      // Index the verification attempt.
      await reportService.record({
        userId: req.user?.id ?? null,
        patientAddress,
        fileName: req.file.originalname,
        contentHash: calculatedHash,
        action: "verify",
        status: hashMatches ? (isRepudiated ? "repudiated" : "valid") : "tampered",
      });

      if (!hashMatches) {
        return res.status(200).json({
          valid: false,
          message: "Document hash mismatch — this file may have been tampered with.",
        });
      }

      if (isRepudiated) {
        return res.status(200).json({
          valid: false,
          message:
            "This certificate was authentic but has been repudiated (revoked) by the authority.",
        });
      }

      return res.status(200).json({
        valid: true,
        message: "Certificate is authentic and active.",
        meta: {
          contentHash: storedHash,
          timestamp: timestamp.toString(),
        },
      });
    } catch (error) {
      logger.error("Validation error", { error: error.message });
      return res.status(500).json({ error: "Verification failed. Please try again." });
    }
  },

  /**
   * Repudiate (revoke) a previously recorded report. Admin-only on-chain.
   */
  repudiateDisease: async (req, res) => {
    try {
      const { subject, index, reason } = req.body;

      if (!subject || !ethers.isAddress(subject)) {
        return res
          .status(400)
          .json({ error: "A valid subject Ethereum address is required." });
      }
      if (index === undefined || index === null || Number.isNaN(Number(index))) {
        return res.status(400).json({ error: "A valid report index is required." });
      }
      if (!reason || !reason.trim()) {
        return res.status(400).json({ error: "A repudiation reason is required." });
      }

      if (!requireChain(res)) return;

      const contract = getMedicalContract();
      const tx = await contract.repudiateReport(subject, Number(index), reason);
      await tx.wait();

      await reportService.record({
        userId: req.user?.id ?? null,
        patientAddress: subject,
        fileName: null,
        contentHash: "0x0",
        action: "repudiate",
        status: "repudiated",
      });

      return res.status(200).json({
        success: true,
        message: "Report repudiated successfully on-chain.",
      });
    } catch (error) {
      logger.error("Repudiation error", { error: error.message });
      return res.status(500).json({ error: error.reason || "Repudiation failed." });
    }
  },

  /**
   * List the authenticated user's report history (DB-indexed).
   */
  getHistory: async (req, res) => {
    try {
      const limit = Math.min(Number(req.query.limit) || 50, 100);
      const offset = Number(req.query.offset) || 0;
      const reports = await reportService.listForUser(req.user.id, { limit, offset });
      return res.status(200).json({ success: true, data: reports });
    } catch (error) {
      logger.error("History fetch error", { error: error.message });
      return res.status(500).json({ error: "Could not load history." });
    }
  },
};
