import Tesseract from "tesseract.js";
import { pdfParse } from "pdf-parse";
import fs from fs

class OcrServices {
    async extractTextFromImage(filePath) {
        try{
            const {data: { text }}= await Tesseract.recognize(filePath, 'eng');
            return text;
        }
        catch(err){
            throw new Error(`OCR failed: ${err.message}`);
        }
    }

    async extractTextFromPDF(filePath){
        try{
            const dataBuffer= fs.readFileSync(filePath);
            const data= await pdfParse(dataBuffer);

            if(!data.text || data.text.trim.length())
        }
    }
}