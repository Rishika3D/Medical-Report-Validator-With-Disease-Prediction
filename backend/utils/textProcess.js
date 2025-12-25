// src/utils/textCleaner.js

export const cleanText = (text) => {
    if (!text) return "";

    return text
        // 1. Convert to lowercase (Standard NLP practice)
        .toLowerCase()
        
        // 2. Remove "scanned" artifacts (common in OCR)
        // Replaces newlines, tabs, and multiple spaces with a single space
        .replace(/\s+/g, ' ')
        
        // 3. Remove non-printable characters (junk bytes)
        // This regex matches anything that is NOT a valid printable character
        .replace(/[^\x20-\x7E]/g, '')

        // 4. Fix common OCR mistakes (Optional but impressive)
        // Example: OCR often mistakes 'O' for '0' in words, or 'l' for '1'
        // This is specific "Business Logic" you can brag about.
        
        // 5. Trim leading/trailing whitespace
        .trim();
};

/**
 * Advanced: If you want to strip everything except numbers and medical units
 * Use this for specific fields like "Blood Pressure"
 */
export const extractMedicalValue = (text) => {
    // Keeps only numbers, dots, slashes, and percent signs
    return text.replace(/[^0-9./%]/g, '');
};