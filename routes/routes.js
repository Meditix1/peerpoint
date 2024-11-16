// See https://expressjs.com/en/guide/routing.html for routing

const express = require('express');
const model = require('../models/test.js')
const router = express.Router();

router.get('/getTestData', function (req, res) {
    try {
        model
            .test()
            .then(function (results) {
                if (results == null) {
                    return res.status(400).json({ message: 'no such user!' });
                }
                console.log(results)
                return res.status(200).json(results);
            })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Unknown Error' });
    }
})

module.exports = router;