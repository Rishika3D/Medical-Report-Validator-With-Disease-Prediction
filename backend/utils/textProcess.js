import natural from "natural";
import unorm from "unorm";

/**
 * Setup tokenizer & spellcheck
 */
const tokenizer = new natural.WordTokenizer();

// Domain-specific dictionary (VERY IMPORTANT)
const DOMAIN_WORDS = [
  "event", "ticket", "price", "total", "amount", "medical",
  "result", "value", "organizer", "date", "time", "venue",
  "blood", "pressure", "sugar", "report"
];

const spellcheck = new natural.Spellcheck(DOMAIN_WORDS);

/**
 * Fix common OCR character confusions using heuristics
 */
const fixOCRCharacters = (text) => {
  return text
    // numeric context fixes
    .replace(/(?<=\d)O|O(?=\d)/g, "0")
    .replace(/(?<=\d)[lI]|[lI](?=\d)/g, "1")
    .replace(/(?<=\d)S|S(?=\d)/g, "5")

    // word context fixes
    .replace(/([a-z])1([a-z])/g, "$1l$2")
    .replace(/([a-z])0([a-z])/g, "$1o$2");
};

/**
 * Spell correction using natural
 * (only correct words that look suspicious)
 */
const spellCorrect = (text) => {
  const words = tokenizer.tokenize(text);

  const corrected = words.map(word => {
    // skip numbers & short tokens
    if (!isNaN(word) || word.length < 3) return word;

    // if already known, keep it
    if (spellcheck.isCorrect(word)) return word;

    // otherwise suggest best correction
    const suggestions = spellcheck.getCorrections(word, 1);
    return suggestions.length ? suggestions[0] : word;
  });

  return corrected.join(" ");
};

/**
 * Main OCR text cleaning pipeline
 */
export const cleanText = (rawText) => {
  if (!rawText) return "";

  let text = rawText;

  // 1. Unicode normalization (CRITICAL for OCR)
  text = unorm.nfkc(text);

  // 2. Lowercase
  text = text.toLowerCase();

  // 3. Normalize whitespace
  text = text.replace(/\s+/g, " ");

  // 4. Remove non-printable characters
  text = text.replace(/[^\x20-\x7E]/g, "");

  // 5. Fix OCR-specific character errors
  text = fixOCRCharacters(text);

  // 6. Spell correction
  text = spellCorrect(text);

  return text.trim();
};

/**
 * Extract numeric medical values (BP, %, glucose, etc.)
 */
export const extractMedicalValue = (text) => {
  if (!text) return "";
  return text.replace(/[^0-9./%]/g, "");
};
