import dotenv from "dotenv";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../utils/logger.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ABI location can be overridden (useful in Docker where the artifact is copied
// to a known path). Defaults to the Hardhat build output in /blockchain.
const ABI_PATH =
  process.env.CONTRACT_ABI_PATH ||
  path.resolve(
    __dirname,
    "../../blockchain/artifacts/contracts/medical.sol/ReportValidator.json"
  );

let contractInstance = null;

function loadAbi() {
  if (!fs.existsSync(ABI_PATH)) {
    throw new Error(
      `Contract ABI not found at ${ABI_PATH}. Run \`npx hardhat compile\` inside /blockchain (or set CONTRACT_ABI_PATH).`
    );
  }
  const parsed = JSON.parse(fs.readFileSync(ABI_PATH, "utf-8"));
  return parsed.abi || parsed;
}

/**
 * True when every value required to talk to the chain is present.
 * Lets the rest of the app degrade gracefully instead of crashing on boot.
 */
export function isBlockchainConfigured() {
  return Boolean(
    process.env.RPC_URL &&
      process.env.PRIVATE_KEY &&
      process.env.CONTRACT_ADDRESS
  );
}

/**
 * Lazily build (and cache) the contract instance.
 * Throws a descriptive error only when actually called — never at import time —
 * so the API server can still serve auth/health endpoints without a chain.
 */
export function getMedicalContract() {
  if (contractInstance) return contractInstance;

  if (!isBlockchainConfigured()) {
    throw new Error(
      "Blockchain not configured. Set RPC_URL, PRIVATE_KEY and CONTRACT_ADDRESS in the environment."
    );
  }

  const abi = loadAbi();
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  contractInstance = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    abi,
    wallet
  );

  logger.info("Smart contract initialized", {
    address: process.env.CONTRACT_ADDRESS,
  });
  return contractInstance;
}

/**
 * Health probe for the chain connection. Never throws — returns a status object.
 */
export async function getBlockchainStatus() {
  if (!isBlockchainConfigured()) {
    return { configured: false, connected: false };
  }
  try {
    const contract = getMedicalContract();
    const provider = contract.runner.provider;
    const [network, blockNumber] = await Promise.all([
      provider.getNetwork(),
      provider.getBlockNumber(),
    ]);
    return {
      configured: true,
      connected: true,
      chainId: Number(network.chainId),
      blockNumber,
      address: contract.target,
    };
  } catch (err) {
    return { configured: true, connected: false, error: err.message };
  }
}
