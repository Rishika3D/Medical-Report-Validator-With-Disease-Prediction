import { medicalContract } from "./services/blockchain.js";
import { ethers } from "ethers";

async function testWrite() {
    console.log("📝 Starting Write Test (Uploading a Fake Report)...");

    try {
        // 1. Create Fake Data
        // In real life, these come from your PDF and IPFS upload
        const fakePatientAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Account #0 (Test)
        
        // Create a random 32-byte hash (Simulating a SHA-256 file hash)
        const fakeContentHash = ethers.hexlify(ethers.randomBytes(32)); 
        
        // Create a fake CID (Simulating IPFS ID converted to bytes)
        // We convert string "QmFake..." to bytes
        const fakeCidBytes = ethers.toUtf8Bytes("QmFakeIPFSHashForTesting123");

        console.log(`   - Patient: ${fakePatientAddress}`);
        console.log(`   - Hash: ${fakeContentHash}`);

        // 2. Send Transaction
        console.log("\n🚀 Sending Transaction to Smart Contract...");
        
        // Calling 'uploadReport' function from your Solidity contract
        const tx = await medicalContract.uploadReport(
            fakePatientAddress,
            fakeContentHash,
            fakeCidBytes
        );

        console.log(`   ⏳ Transaction Sent! Hash: ${tx.hash}`);
        console.log("   ⏳ Waiting for confirmation...");

        // 3. Wait for Block Confirmation
        const receipt = await tx.wait();

        console.log("\n✅ TRANSACTION MINED!");
        console.log(`   - Block Number: ${receipt.blockNumber}`);
        console.log(`   - Gas Used: ${receipt.gasUsed.toString()}`);
        console.log("\n🎉 BLOCKCHAIN INTEGRATION COMPLETE!");
        process.exit(0);

    } catch (error) {
        console.error("\n❌ WRITE FAILED");
        console.error("Reason:", error.message);
        // Common error check
        if (error.message.includes("uploader only")) {
            console.error("💡 Hint: Your .env PRIVATE_KEY is not the Admin/Uploader of this contract.");
        }
        process.exit(1);
    }
}

testWrite();