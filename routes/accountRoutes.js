// See https://expressjs.com/en/guide/routing.html for routing

const express = require('express');
const model = require('../models/accountModel')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/createAccount', async function (req, res) {
    try {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
        email = req.body.email;
        oauth_provider = req.body.oauth_provider;
        oauth_id = req.body.oauth_id;
        model
            .createAccount(hashedPassword, email, oauth_provider, oauth_id)
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

router.get('/checkAccountExists', function (req, res) {
    try {
        email = req.query.email;
        model.checkAccountExists(email)
            .then(function (result) {
                if (result == null) {
                    return res.status(400).json({ message: 'error!' });
                }
                return res.status(200).json(result)
            })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Unknown Error' });
    }
})

router.post('/login', async function (req, res) {
    let email = req.body.email;
    let password = req.body.password;

    try {
        return model
            .authenticate(email)
            .then(async function (results) {
                if ((password == null) || (results == null)) {
                    return res.status(400).json({ message: 'login failed' });
                }

                if (bcrypt.compareSync(password, results.password_hash) == true) {
                    if (results.user_id) {
                        console.log(results)
                        const user = { id: results.user_id, email: results.email, username: results.username };
                        const token = generateToken(user)
                        return res.status(200).json(token)
                    }
                } else {
                    return res.status(400).json("Invalid credentials");
                }
            })
            .catch(function (error) {
                console.log(error);
                return res.status(500).json({ error: 'Unknown Error!' });
            });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Unknown Error' });
    }
});

router.post('/uploadProfilePic', authMiddleware,  async function (req, res) {
    let b64string = req.body.b64string;
    let token = req.body.token;
    console.log(b64string);
    try {
        return model
            .uploadProfilePicture(b64string, token)
            .then(function (results) {
                return res.status(200).json("Success");
            })
            .catch(function (error) {
                console.log(error);
                return res.status(500).json({ error: 'Unknown Error!' });
            });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Unknown Error' });
    }
});

router.get('/getUserInfo', async function (req,res) {
    try {
        userid = req.query.user_id;
        model.getUserInfo(userid)
            .then(function (result) {
                if (result == null) {
                    return res.status(400).json({ message: 'error!' });
                }
                console.log(result)
                return res.status(200).json(result)
            })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Unknown Error' });
    }
})

const generateToken = (user) => {
    // Create a payload with user info
    const payload = {
        user: {
            id: user.id,
            email: user.email,
            username: user.username
        }
    };

    // Generate the token
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });

    return token;
};

module.exports = router;