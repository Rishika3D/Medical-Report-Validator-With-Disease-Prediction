// Import the contract instance we created earlier
// Ensure this path matches where you put your blockchain.js file
import { getMedicalContract } from "./services/blockchain.js";

async function testConnection() {
    console.log("🔄 Starting Connection Test...\n");

    try {
        // 1. Check if the Contract Address is loaded
        // If this is undefined, your .env is not being read correctly
        console.log("1️⃣  Checking Contract Instance...");
        const medicalContract = getMedicalContract();
        const address = medicalContract.target;
        console.log(`   ✅ Contract Address Found: ${address}`);

        // 2. Check the Network Connection
        // We access the 'provider' hidden inside the contract wallet (runner)
        console.log("\n2️⃣  Pinging the Blockchain...");
        const provider = medicalContract.runner.provider;
        
        // Try to get the latest block number (Simple read operation)
        const blockNumber = await provider.getBlockNumber();
        console.log(`   ✅ Connection Successful!`);
        console.log(`   📦 Current Block Number: ${blockNumber}`);

        // 3. Check Chain ID (Optional safety check)
        const network = await provider.getNetwork();
        console.log(`   🔗 Connected to Chain ID: ${network.chainId}`);

        console.log("\n🎉 GREAT SUCCESS: Backend is fully connected to Blockchain.");
        process.exit(0);

    } catch (error) {
        console.error("\n❌ CONNECTION FAILED");
        console.error("---------------------");
        
        if (error.code === "ECONNREFUSED") {
            console.error("Reason: The Blockchain is unreachable.");
            console.error("Fix: Is your Hardhat node/Ganache running? Check RPC_URL in .env.");
        } else if (error.code === "INVALID_ARGUMENT") {
            console.error("Reason: Invalid Private Key or Address.");
            console.error("Fix: Check .env for spaces or missing characters.");
        } else {
            console.error("Error Details:", error);
        }
        process.exit(1);
    }
}

testConnection();