// models/ocrModel.js
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

// Function to extract text from images using OCR (Tesseract.js)
async function extractTextFromImage(filePath) {
  try {
    const { data: { text } } = await Tesseract.recognize(
      filePath,
      'eng', // Use English language for OCR
      { logger: (m) => console.log(m) } // Optional: log OCR progress
    );

    return text.trim(); // Return the cleaned-up text
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Error processing image');
  }
}

module.exports = { extractTextFromImage };
