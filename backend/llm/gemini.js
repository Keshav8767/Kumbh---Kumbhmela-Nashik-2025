const { GoogleGenAI } = require('@google/genai');

// Initialize the Google Gen AI client with the key from .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Helper to generate a response via Gemini Flash.
 *
 * @param {string} systemInstruction - Context or role the AI should assume
 * @param {string} prompt - The direct prompt/query
 * @returns {Promise<string>} - The model's text response
 */
async function generateResponse(systemInstruction, prompt) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3, // keep responses grounded in facts
      }
    });

    return response.text;
  } catch (error) {
    console.error('Error in Gemini generation:', error);
    throw error;
  }
}

module.exports = {
  generateResponse
};
