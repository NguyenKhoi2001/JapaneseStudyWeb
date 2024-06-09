// utils/translateText.js

// Import the google-translate-api or its equivalent that you've installed
import translate from "google-translate-api";

/**
 * Translates text from any language to the specified language.
 *
 * @param {string} text The text to translate.
 * @param {string} targetLang The language you want to translate the text into. (e.g., 'en' for English, 'vi' for Vietnamese)
 * @returns {Promise<string>} The translated text.
 */
const TranslateText = async (text, targetLang) => {
  try {
    const result = await translate(text, { to: targetLang });
    return result.text;
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};

export default TranslateText;
