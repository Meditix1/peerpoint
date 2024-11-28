// See https://expressjs.com/en/guide/routing.html for routing

const express = require('express');
const model = require('../models/groupModel.js')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/createGroup', authMiddleware, async function (req, res) {
    try {
        grpName = req.body.grpName;
        grpDesc = req.body.grpDesc;
        invitedMembers = req.body.invitedMembers;
        token = req.body.jwt;
        model
            .createGroup(grpName,grpDesc,invitedMembers, token)
            .then(function (results) {
                if (results == null) {
                    return res.status(400).json({ message: 'error!' });
                }
                console.log(results)
                return res.status(200).json(results);
            })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Unknown Error' });
    }
})

router.get('/getUserViewableGroups', authMiddleware, async function (req,res) {
    try {
        jwtToken = req.query.token;
        model
        .getUserViewableGroups(jwtToken)
        .then(function(results) {
            return res.status(200).json(results);
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message:"Unknown Error!"});
    }
});

router.get('/getGroupDetails', authMiddleware, async function (req,res) {
    try {
        groupId = req.query.group_id;
        model
        .getGroupDetails(groupId)
        .then(function(results) {
            return res.status(200).json(results);
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message:"Unknown Error!"});
    }
}) 

router.post('/addNewMember', authMiddleware, async function (req, res) {
    try {
        group_id = req.body.group_id;
        invited_user_email = req.body.invited_user_email;

        model
            .addMember(group_id, invited_user_email)
            .then(function (results) {
                if(results.error) {
                    return res.status(400).json(results)
                }
                return res.status(200).json(results);
            })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error });
    }
})
module.exports = router;