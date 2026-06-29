import db from "../db/db.js";
import { logger } from "../utils/logger.js";

/**
 * Persistence for report submissions / verifications.
 * Failures here are logged but never block the on-chain flow — the blockchain
 * remains the source of truth; the DB is an indexed convenience copy.
 */
const reportService = {
  async record({
    userId,
    patientAddress,
    fileName,
    contentHash,
    ipfsCid = null,
    txHash = null,
    mlPrediction = null,
    mlConfidence = null,
    action = "submit",
    status = "recorded",
  }) {
    try {
      const result = await db.query(
        `INSERT INTO reports
           (user_id, patient_address, file_name, content_hash, ipfs_cid,
            tx_hash, ml_prediction, ml_confidence, action, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, created_at`,
        [
          userId,
          patientAddress,
          fileName,
          contentHash,
          ipfsCid,
          txHash,
          mlPrediction,
          mlConfidence,
          action,
          status,
        ]
      );
      return result.rows[0];
    } catch (err) {
      logger.error("Failed to persist report", { error: err.message });
      return null;
    }
  },

  async listForUser(userId, { limit = 50, offset = 0 } = {}) {
    const result = await db.query(
      `SELECT id, patient_address, file_name, content_hash, ipfs_cid, tx_hash,
              ml_prediction, ml_confidence, action, status, created_at
         FROM reports
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  },
};

export default reportService;
