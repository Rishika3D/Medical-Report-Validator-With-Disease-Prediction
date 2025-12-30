import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

/**
 * 1. Chest X-Ray Analyzer
 * Uses the official library's imageClassification task
 */
export async function analyzeXray(imageBuffer) {
    console.log(`🩻 Sending X-Ray to model: ${process.env.HF_XRAY_ID}...`);
    
    try {
        const result = await hf.imageClassification({
            model: process.env.HF_XRAY_ID,
            data: imageBuffer
        });
        return result;
    } catch (error) {
        console.error("❌ X-Ray Model Error:", error.message);
        throw error;
    }
}

/**
 * 2. Medical Report Validator
 * Uses the official library's textClassification task
 */
export async function validateReportText(reportText) {
    console.log(`📄 Validating Report with model: ${process.env.HF_VALIDATOR_ID}...`);

    try {
        const result = await hf.textClassification({
            model: process.env.HF_VALIDATOR_ID,
            inputs: reportText
        });
        return result;
    } catch (error) {
        console.error("❌ Text Model Error:", error.message);
        throw error;
    }
}