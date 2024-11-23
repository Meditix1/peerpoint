const express = require('express');
const model = require('../models/mainModel')
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');


router.get('/dashboard', authMiddleware, async function (req, res) {
    try {
        return res.status(200).json("dashboard results");

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Unknown Error' });
    }
})

module.exports = router;