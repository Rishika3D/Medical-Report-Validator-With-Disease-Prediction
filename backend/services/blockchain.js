import dotenv from "dotenv";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 1. Initialize Environment Variables
dotenv.config();

// ... imports ...

// 1. Setup path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Point to the .env (Up 2 levels to root)
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

// 3. FIX THE ABI PATH HERE:
const abiPath = path.resolve(__dirname, "../../medchain-smart-contracts/artifacts/contracts/medical.sol/ReportValidator.json");

// ... rest of the file checks and code ...
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
