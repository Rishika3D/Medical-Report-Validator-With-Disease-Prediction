import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

/**
 * 1. Chest X-Ray Analyzer
 * Uses the official library's imageClassification task
 */
const ML_SERVICE_URL = "http://127.0.0.1:5001";

/**
 * 1. Chest X-Ray Analyzer
 * Uses LOCAL Python ML Service
 */
export async function analyzeXray(imageBuffer) {
    console.log(`🩻 Sending X-Ray to Local ML Service...`);

    try {
        const formData = new FormData();
        const blob = new Blob([imageBuffer]); // Convert buffer to blob for upload
        formData.append("image", blob, "xray.jpg");

        const response = await axios.post(`${ML_SERVICE_URL}/analyze-xray`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return response.data.data;
    } catch (error) {
        console.error("❌ X-Ray Model Error:", error.message);
        // Fallback to HF or just throw
        throw error;
    }
}

/**
 * 2. Medical Report Validator / Disease Predictor
 * Uses LOCAL Python ML Service
 */
export async function predictDiseaseLocal(symptoms) {
    console.log(`📄 Predicting Disease for symptoms: ${symptoms}...`);

    try {
        const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
            symptoms: symptoms
        });

        return response.data.data;
    } catch (error) {
        console.error("❌ ML Prediction Error:", error.message);
        throw error;
    }
}

/* Legacy Hugging Face (Optional to keep) */
export async function validateReportText(reportText) {
    // ... potentially reuse this or deprecate
    return predictDiseaseLocal(reportText);
}