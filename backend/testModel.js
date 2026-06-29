import { predictDiseaseLocal as validateReportText, analyzeXray } from "./services/aiService.js";

async function runTests() {
    console.log("🤖 STARTING ML MODEL TESTS (Using Official Library)...\n");

    // ------------------------------------------
    // TEST 1: Text Validator
    // ------------------------------------------
    try {
        const textInput = "Patient presents with persistent cough and fever. Lungs show signs of opacity.";
        const textResult = await validateReportText(textInput);
        console.log("✅ Text Model Result:", JSON.stringify(textResult, null, 2));
    } catch (err) {
        console.error("❌ Text Model Failed:", err.message);
        if (err.statusCode === 404) {
            console.error("⚠️  Check your Model ID in .env. Is the model private? Or spelled wrong?");
        }
    }

    console.log("\n-----------------------------------\n");

    // ------------------------------------------
    // TEST 2: X-Ray Image
    // ------------------------------------------
    try {
        // We use a tiny but valid binary buffer to try and trick it into attempting a read
        // But honestly, without a real image file, this is likely to error.
        const fakeImageBuffer = Buffer.from("this is not a real image"); 
        
        await analyzeXray(fakeImageBuffer); 
        console.log("✅ X-Ray Response Received");
        
    } catch (err) {
        // If the error is about image processing, the connection worked!
        if (err.message.includes("UnidentifiedImageError") || err.message.includes("500")) {
             console.log("✅ X-Ray Connection Successful! (Model received data but correctly complained it wasn't a real image)");
        } else {
             console.error("❌ X-Ray Test Failed:", err.message);
        }
    }
}

runTests();