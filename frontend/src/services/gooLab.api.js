import { GOO_LAB_API_URL, GOO_LAB_APPLICATION_ID } from "./api.config";
/**
 * Converts a Japanese sentence to Hiragana using Goo Lab API.
 *
 * @param {string} sentence - The sentence to convert.
 * @returns {Promise<string>} - A promise that resolves with the converted Hiragana sentence.
 */
export const convertToHiragana = async (sentence) => {
  const data = {
    app_id: GOO_LAB_APPLICATION_ID,
    sentence: sentence,
    output_type: "hiragana",
  };

  try {
    const response = await fetch(GOO_LAB_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const jsonData = await response.json();
    if (!response.ok) {
      throw new Error(`API call failed: ${jsonData.message}`);
    }
    return jsonData.converted;
  } catch (error) {
    console.error("Error converting sentence to Hiragana:", error);
    throw error;
  }
};
