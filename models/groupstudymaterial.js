
const { query } = require('../database');
const pool = require('../database.js')
const bcrypt = require('bcrypt');
const { configDotenv } = require('dotenv');
const jwt = require('jsonwebtoken');

// Function to add study material to a group
const addStudyMaterial = async (groupId, userId, content, tags) => {
    try {
        // Ensure content is provided
        if (!content) {
            throw new Error('Content is required.');
        }

        // Insert study material into the 'group_study_materials' table
        const sql = `
            INSERT INTO group_study_materials (group_id, user_id, content, tags)
            VALUES ($1, $2, $3, $4)
            RETURNING id, group_id, user_id, content, tags, created_at
        `;
        const values = [groupId, userId, content, tags]; // Parameterized query to prevent SQL injection

        // Execute the query to insert the study material
        const result = await query(sql, values);
        const newMaterial = result.rows[0]; // Extract the inserted material data

        // Return the newly added study material
        return newMaterial;
    } catch (error) {
        console.error('Error adding material:', error);
        throw new Error('An error occurred while adding the study material.');
    }
};

// Export the function to be used in your route


  const getStudyMaterialsByGroup = async (groupId) => {
    try {
        // Query to fetch all materials for a specific group, ordered by the most recent
        const sql = `
            SELECT id, group_id, user_id, content, tags, created_at
            FROM group_study_materials
            WHERE group_id = $1
            ORDER BY created_at DESC
        `;
        
        // Execute the query with the group ID as the parameter
        const result = await query(sql, [groupId]);
        
        // Return the list of materials (or an empty array if none are found)
        return result.rows;
    } catch (error) {
        console.error('Error fetching materials:', error);
        throw new Error('An error occurred while fetching study materials.');
    }
};
  
  module.exports = { addStudyMaterial,getStudyMaterialsByGroup };