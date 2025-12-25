import Tesseract from "tesseract.js";
import { pdfParse } from "pdf-parse";
import fs from "fs"
import { cleanText } from "../utils/textProcess.js";

class OcrServices {
    async extractTextFromImage(filePath) {
        try{
            const {data: { text }}= await Tesseract.recognize(filePath, 'eng');

            const cleaned= cleanText(text);
            return cleaned;
        }
        catch(err){
            throw new Error(`OCR failed: ${err.message}`);
        }
    }

    async extractTextFromPDF(filePath){
        try{
            const dataBuffer= fs.readFileSync(filePath);
            const data= await pdfParse(dataBuffer);
            if(!data.text || data.text.trim.length()===0){
                throw new Error("SCANNED_PDF_DETECTED"); 
            }
            
            const clean= cleanText(data.text);
            return clean;
        }
        catch(err){
            throw err;
        }
    }
}

export default new OcrServices();