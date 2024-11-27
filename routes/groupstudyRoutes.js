const express = require('express');
const model = require('../models/groupstudymaterial.js')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware.js');


// Endpoint to add study material to a group
router.post('/:groupId/materials', async (req, res) => {
    const { groupId } = req.params;
    const { token, content, tags } = req.body;
    console.log(token)
  
    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }
  
    try {
      // Decode the JWT Token
      var decoded = jwt.decode(token);
      var userId = decoded.user.id;
      // Add study material to the group using the model
      const material = await model.addStudyMaterial(groupId, userId, content, tags);
      res.status(201).json({ message: 'Material added successfully!', material });
    } catch (error) {
      console.error('Error adding material:', error);
      res.status(500).json({ message: 'An error occurred while adding material.' });
    }
  });
  
  // Endpoint to retrieve study materials for a group
  router.get('/:groupId/materials', async (req, res) => {
    const { groupId } = req.params;
  
    try {
      // Get materials for the group using the model
      const materials = await model.getStudyMaterialsByGroup(groupId);
      res.status(200).json({ materials });
    } catch (error) {
      console.error('Error fetching materials:', error);
      res.status(500).json({ message: 'An error occurred while fetching materials.' });
    }
  });
  
  module.exports = router;