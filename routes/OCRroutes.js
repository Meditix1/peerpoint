const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ocrModel = require('../models/OCR'); // Import OCR model

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use the correct path for the 'uploads' folder in the root project directory
    const uploadDir = path.join(__dirname, '..', 'uploads');  // Go one level up from routes
    console.log(`Saving file to: ${uploadDir}`); // Log the directory

    // Create "uploads" directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Ensure folder creation
      console.log('Uploads directory created.');
    }
    cb(null, uploadDir); // Set the destination
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname); // Create a unique file name
    cb(null, fileName); // Set the file name
    console.log(`File uploaded: ${fileName}`); // Log file upload
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Endpoint to upload and process image
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Log the uploaded file path (after multer has saved the file)
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);  // Ensure this path is correct
    console.log('Uploaded file path:', filePath);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ message: 'Error: File not found after upload' });
    }

    // Use OCR to extract text
    const extractedText = await ocrModel.extractTextFromImage(filePath);

    // Cleanup and return the cleaned extracted text
    let cleanedText = extractedText.trim();
    cleanedText = cleanedText.replace(/[«+]/g, '');
    cleanedText = cleanedText.replace(/\n+/g, '\n');
    cleanedText = cleanedText.replace(/\s{2,}/g, ' ');

    // Return the cleaned text
    res.status(200).json({
      success: true,
      extractedText: cleanedText,
    });

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ message: 'Error processing image, please try again later.' });
  }
});

module.exports=router