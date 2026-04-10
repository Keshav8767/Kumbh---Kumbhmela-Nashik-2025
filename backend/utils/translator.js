const LANGUAGES = {
  'English': 'en',
  'हिन्दी': 'hi',
  'मराठी': 'mr',
  'ગુજરાતી': 'gu',
  'தமிழ்': 'ta',
  'తెలుగు': 'te',
  'ಕನ್ನಡ': 'kn',
  'മലയാളം': 'ml',
  'বাংলা': 'bn',
  'ਪੰਜਾਬੀ': 'pa'
};

async function translateText(text, targetLang) {
  try {
    // Using Google Translate API (free tier via MyMemory)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    );
    const data = await response.json();
    
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
    return text; // Return original if translation fails
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

async function detectLanguage(text) {
  // Simple language detection based on Unicode ranges
  const hindiRegex = /[\u0900-\u097F]/;
  const marathiRegex = /[\u0900-\u097F]/;
  const gujaratiRegex = /[\u0A80-\u0AFF]/;
  const tamilRegex = /[\u0B80-\u0BFF]/;
  const teluguRegex = /[\u0C00-\u0C7F]/;
  const kannadaRegex = /[\u0C80-\u0CFF]/;
  const malayalamRegex = /[\u0D00-\u0D7F]/;
  const bengaliRegex = /[\u0980-\u09FF]/;
  const punjabiRegex = /[\u0A00-\u0A7F]/;
  
  if (hindiRegex.test(text)) return 'hi';
  if (marathiRegex.test(text)) return 'mr';
  if (gujaratiRegex.test(text)) return 'gu';
  if (tamilRegex.test(text)) return 'ta';
  if (teluguRegex.test(text)) return 'te';
  if (kannadaRegex.test(text)) return 'kn';
  if (malayalamRegex.test(text)) return 'ml';
  if (bengaliRegex.test(text)) return 'bn';
  if (punjabiRegex.test(text)) return 'pa';
  
  return 'en'; // Default to English
}

module.exports = {
  LANGUAGES,
  translateText,
  detectLanguage
};
