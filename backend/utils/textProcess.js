// src/utils/textCleaner.js

/**
 * Fix common OCR character mistakes using context-aware rules
 */
const fixOCRCharacters = (text) => {
    return text
      // O → 0 only when surrounded by digits
      .replace(/(?<=\d)O|O(?=\d)/g, "0")
  
      // l / I → 1 when near digits
      .replace(/(?<=\d)[lI]|[lI](?=\d)/g, "1")
  
      // S → 5 when numeric context
      .replace(/(?<=\d)S|S(?=\d)/g, "5");
  };
  
  /**
   * Fix known OCR word confusions (domain-specific)
   */
  const fixWordConfusions = (text) => {
    const CONFUSION_MAP = {
      "tota1": "total",
      "arnount": "amount",
      "va1ue": "value",
      "1tem": "item",
      "resu1t": "result",
      "medica1": "medical",
    };
  
    return text
      .split(" ")
      .map(word => CONFUSION_MAP[word] || word)
      .join(" ");
  };
  
  /**
   * Normalize numbers safely
   */
  const normalizeNumbers = (text) => {
    return text.replace(/\b[\dOIl,]+\b/g, (token) => {
      const normalized = token
        .replace(/O/g, "0")
        .replace(/l/g, "1")
        .replace(/I/g, "1");
  
      return isNaN(normalized.replace(/,/g, "")) ? token : normalized;
    });
  };
  
  /**
   * Main text cleaning pipeline
   */
  export const cleanText = (text) => {
    if (!text) return "";
  
    let cleaned = text
      .toLowerCase()
  
      // Normalize whitespace
      .replace(/\s+/g, " ")
  
      // Remove non-printable junk
      .replace(/[^\x20-\x7E]/g, "");
  
    cleaned = fixOCRCharacters(cleaned);
    cleaned = fixWordConfusions(cleaned);
    cleaned = normalizeNumbers(cleaned);
  
    return cleaned.trim();
  };
  
  /**
   * Extract numeric medical values (BP, sugar, %, etc.)
   */
  export const extractMedicalValue = (text) => {
    if (!text) return "";
    return text.replace(/[^0-9./%]/g, "");
  };
  