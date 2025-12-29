import dotenv from "dotenv";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 1. Initialize Environment Variables
dotenv.config();

// 2. Fix for missing __dirname in ES Modules
// In ESM, __dirname doesn't exist, so we recreate it manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3. Load the ABI securely
// Go up one level (..) to find the 'abi' folder
const abiPath = path.resolve(__dirname, "../abi/ReportValidator.json");

if (!fs.existsSync(abiPath)) {
    throw new Error(`❌ ABI not found at: ${abiPath}`);
}

const rawABI = fs.readFileSync(abiPath, "utf-8");
const contractData = JSON.parse(rawABI);

// Handle cases where ABI is nested in an "abi" property (Hardhat default)
const contractABI = contractData.abi || contractData;

// 4. Setup Provider & Wallet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// 5. Create Contract Instance
const medicalContract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractABI,
    wallet
);

console.log("✅ Smart Contract Connected!");

// 6. Export using ES Module syntax
export { medicalContract };
