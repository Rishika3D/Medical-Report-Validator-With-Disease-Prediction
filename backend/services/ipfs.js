import axios from "axios";
import FormData from "form-data";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

/**
 * 1. Calculate SHA-256 Hash (Required by your contract 'contentHash')
 */
export function calculateFileHash(fileBuffer) {
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return "0x" + hashSum.digest('hex'); // Returns 0x... format
}

/**
 * 2. Upload to IPFS via Pinata
 */
export async function uploadToIPFS(fileBuffer, fileName) {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    // Create a form with the file data
    let data = new FormData();
    data.append('file', fileBuffer, fileName);

    // Optional: Add metadata so you can find it easily on Pinata website
    const metadata = JSON.stringify({
        name: fileName,
        keyvalues: {
            project: 'MedicalValidator'
        }
    });
    data.append('pinataMetadata', metadata);

    try {
        const response = await axios.post(url, data, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                'pinata_api_key': process.env.IPFS_API_KEY,
                'pinata_secret_api_key': process.env.IPFS_API_SECRET
            }
        });

        // This is the CID (e.g., QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco)
        return response.data.IpfsHash; 

    } catch (error) {
        console.error("IPFS Upload Error:", error);
        throw new Error("Failed to upload to IPFS");
    }
}