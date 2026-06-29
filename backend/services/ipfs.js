import axios from "axios";
import FormData from "form-data";
import crypto from "crypto";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config();

const PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const IPFS_TIMEOUT_MS = Number(process.env.IPFS_TIMEOUT_MS) || 60000;

/**
 * SHA-256 of the file, returned as the 0x-prefixed bytes32 the contract expects.
 */
export function calculateFileHash(fileBuffer) {
  return "0x" + crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

function isIpfsConfigured() {
  return Boolean(
    process.env.IPFS_JWT || (process.env.IPFS_API_KEY && process.env.IPFS_API_SECRET)
  );
}

/**
 * Pin a file to IPFS via Pinata. Prefers JWT auth, falls back to key/secret.
 */
export async function uploadToIPFS(fileBuffer, fileName) {
  if (!isIpfsConfigured()) {
    throw new Error("IPFS (Pinata) credentials are not configured.");
  }

  const data = new FormData();
  data.append("file", fileBuffer, fileName);
  data.append(
    "pinataMetadata",
    JSON.stringify({ name: fileName, keyvalues: { project: "MediChain" } })
  );

  const authHeaders = process.env.IPFS_JWT
    ? { Authorization: `Bearer ${process.env.IPFS_JWT}` }
    : {
        pinata_api_key: process.env.IPFS_API_KEY,
        pinata_secret_api_key: process.env.IPFS_API_SECRET,
      };

  try {
    const response = await axios.post(PINATA_URL, data, {
      maxBodyLength: Infinity,
      timeout: IPFS_TIMEOUT_MS,
      headers: { ...data.getHeaders(), ...authHeaders },
    });
    return response.data.IpfsHash;
  } catch (error) {
    const detail = error.response?.data?.error || error.message;
    logger.error("IPFS upload failed", { detail });
    throw new Error("Failed to upload to IPFS");
  }
}
