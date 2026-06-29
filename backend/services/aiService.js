import axios from "axios";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:5001";
const ML_TIMEOUT_MS = Number(process.env.ML_TIMEOUT_MS) || 30000;

/**
 * Chest X-ray / image analysis via the Python ML service (which proxies to
 * HuggingFace). Throws on failure so callers can decide how to degrade.
 */
export async function analyzeXray(imageBuffer) {
  const formData = new FormData();
  const blob = new Blob([imageBuffer]);
  formData.append("image", blob, "report-image");

  const response = await axios.post(`${ML_SERVICE_URL}/analyze-xray`, formData, {
    timeout: ML_TIMEOUT_MS,
  });
  return response.data.data;
}

/**
 * Text-based disease/report analysis via the Python ML service.
 */
export async function predictDiseaseLocal(symptoms) {
  const response = await axios.post(
    `${ML_SERVICE_URL}/predict`,
    { symptoms },
    { timeout: ML_TIMEOUT_MS }
  );
  return response.data.data;
}

/**
 * Health probe for the ML service. Never throws — returns a status object.
 */
export async function getMlStatus() {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 5000 });
    return { connected: true, ...response.data };
  } catch (err) {
    logger.debug("ML service health check failed", { error: err.message });
    return { connected: false, error: err.message };
  }
}
