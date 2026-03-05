import { ethers } from "ethers";
import { medicalContract } from "../services/blockchain.js";
import { uploadToIPFS, calculateFileHash } from "../services/ipfs.js";
import { analyzeXray } from "../services/aiService.js";

// Optional: If you decided on a DB (Firebase/Postgres), import it here
// import { db } from "../config/db.js";

export const reportController = {

    /**
     * 1. Submit a New Medical Report
     * Flow: Front-end sends File + Data -> Server hashes File -> Uploads to IPFS -> Writes to Blockchain
     *
     * Required body fields:
     *   - patientAddress: Ethereum address of the patient
     *   - diseaseType: (for metadata/response only, not stored on-chain)
     * Required file: report (multipart/form-data)
     */
    submitMedicalReport: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No certificate file provided" });
            }

            const { patientAddress, diseaseType } = req.body;

            if (!patientAddress || !ethers.isAddress(patientAddress)) {
                return res.status(400).json({ error: "A valid patient Ethereum address is required" });
            }

            const fileBuffer = req.file.buffer;
            const fileName = req.file.originalname;

            console.log(`Processing report for: ${patientAddress}`);

            // A. Generate the Content Hash (The fingerprint) — returns "0x<64 hex chars>" (bytes32)
            const contentHash = calculateFileHash(fileBuffer);
            console.log("Generated Hash:", contentHash);

            // ML ANALYSIS
            let mlPrediction = "Unknown";
            let mlConfidence = 0;
            try {
                console.log("Analyzing file with ML Model...");
                const analysis = await analyzeXray(fileBuffer);
                mlPrediction = analysis.condition || analysis.disease || "Unknown";
                mlConfidence = analysis.confidence || 0;
                console.log(`ML Prediction: ${mlPrediction} (${mlConfidence})`);
            } catch (err) {
                console.warn("ML Analysis failed, proceeding without it:", err.message);
            }

            // B. Upload to IPFS
            const ipfsHash = await uploadToIPFS(fileBuffer, fileName);
            console.log("IPFS CID:", ipfsHash);

            // C. Write to Blockchain
            // Contract: uploadReport(address subject, bytes32 contentHash, bytes cidBytes)
            const cidBytes = ethers.toUtf8Bytes(ipfsHash); // Convert CID string to bytes

            console.log("Sending transaction to blockchain...");
            const tx = await medicalContract.uploadReport(
                patientAddress, // address subject
                contentHash,    // bytes32 contentHash (ethers auto-converts hex string)
                cidBytes        // bytes cidBytes
            );

            const receipt = await tx.wait();

            res.status(201).json({
                success: true,
                message: "Medical report minted successfully",
                data: {
                    transactionHash: receipt.hash,
                    ipfsHash: ipfsHash,
                    contentHash: contentHash,
                    mlPrediction,
                    mlConfidence
                }
            });

        } catch (error) {
            console.error("Submission Error:", error);
            res.status(500).json({
                success: false,
                error: error.message || "Failed to submit report"
            });
        }
    },

    /**
     * 2. Validate/Verify a Certificate
     * Flow: User uploads a file + patientAddress -> We hash it -> Check hash on blockchain
     *
     * Required body fields:
     *   - patientAddress: Ethereum address of the patient
     * Required file: report (multipart/form-data)
     */
    validateCertificate: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "Please upload the document to verify" });
            }

            const { patientAddress } = req.body;

            if (!patientAddress || !ethers.isAddress(patientAddress)) {
                return res.status(400).json({ error: "A valid patient Ethereum address is required" });
            }

            const fileBuffer = req.file.buffer;

            // A. Calculate Hash of the uploaded document
            const calculatedHash = calculateFileHash(fileBuffer);

            // B. Fetch the latest stored report from the Blockchain
            // Contract: getLatestReport(address user) returns (bytes32, bytes, uint64, bool, string)
            let storedReport;
            try {
                storedReport = await medicalContract.getLatestReport(patientAddress);
            } catch (err) {
                // Contract reverts with "no reports" if address has no records
                return res.status(404).json({
                    valid: false,
                    message: "No reports found for this address on the blockchain."
                });
            }

            const [storedHash, , , isRepudiated] = storedReport;

            // C. Compare hashes
            const isValid = storedHash === calculatedHash;

            if (!isValid) {
                return res.status(200).json({
                    valid: false,
                    message: "Document hash mismatch! This file may have been tampered with."
                });
            }

            if (isRepudiated) {
                return res.status(200).json({
                    valid: false,
                    message: "This certificate was authentic but has been REPUDIATED (Revoked) by the authority."
                });
            }

            res.status(200).json({
                valid: true,
                message: "Certificate is Authentic and Active.",
                meta: {
                    contentHash: storedHash,
                    timestamp: storedReport[2].toString()
                }
            });

        } catch (error) {
            console.error("Validation Error:", error);
            res.status(500).json({ error: "Validation failed on blockchain" });
        }
    },

    /**
     * 3. Repudiate (Revoke) a Disease Claim
     * Flow: Admin sends subject address + report index + reason -> Contract updates status
     *
     * Required body fields:
     *   - subject: Ethereum address of the patient
     *   - index: Index of the report to repudiate
     *   - reason: Reason for repudiation
     */
    repudiateDisease: async (req, res) => {
        try {
            const { subject, index, reason } = req.body;

            if (!subject || !ethers.isAddress(subject)) {
                return res.status(400).json({ error: "A valid subject Ethereum address is required" });
            }

            if (index === undefined || index === null) {
                return res.status(400).json({ error: "Report index is required" });
            }

            if (!reason) {
                return res.status(400).json({ error: "Repudiation reason is required" });
            }

            console.log(`Repudiating report for ${subject} at index ${index} for reason: ${reason}`);

            // Contract: repudiateReport(address subject, uint256 index, string reason)
            const tx = await medicalContract.repudiateReport(subject, index, reason);
            await tx.wait();

            res.status(200).json({
                success: true,
                message: "Disease claim repudiated successfully on-chain."
            });

        } catch (error) {
            console.error("Repudiation Error:", error);
            res.status(500).json({ error: error.reason || error.message });
        }
    }
};
