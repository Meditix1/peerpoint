const { query } = require('../database');
const pool = require('../database.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { configDotenv } = require('dotenv');

// ------------------------- Functions ------------------------------///

// Creates a new account
module.exports.createAccount = async function createAccount(password, email, username) {
    try {

        const sql = `INSERT INTO users (password_hash, email, username) 
        VALUES ($1, $2, $3)`;

        console.log('Executing query:', sql, [password, email, username]);
        var results = await query(sql, [password, email, username]);
        console.log(results)
        return results;

    } catch (error) {
        throw error;
    }
}

// Checks if a username/email already exists
module.exports.checkAccountExists = function checkAccountExists(email) {
    const sql = 'SELECT 1 FROM users WHERE email = $1';

    console.log('Executing query:', sql, [email]);
    return query(sql, [email])
        .then(result => result.rowCount > 0);
}

module.exports.authenticate = (email) => {
    const sql = `SELECT user_id, username, email, password_hash FROM users WHERE email=$1`;
    console.log('querying from sql database');
    return query(sql, [email]).then(function (result) {
        const rows = result.rows;

        if (rows.length === 0) {
            throw new Error(`no such user`);
        }
        return rows[0];
    });
}

module.exports.uploadProfilePicture = (b64string, token) => {
    const decoded = jwt.decode(token);
    const requestingUserId = decoded.user.id;

    const sql = `UPDATE users
                SET profile_pic = '${b64string}'
                WHERE user_id = '${requestingUserId}';
`
    return query(sql);
}

module.exports.updateUsername = async (newUsername, token) => {
    const decoded = jwt.decode(token);
    const requestingUserId = decoded.user.id;

    const sqlUpdate = `
        UPDATE users
        SET username = $1
        WHERE user_id = $2
        RETURNING user_id, username, email;
    `;

    try {
        const updateResults = await query(sqlUpdate, [newUsername, requestingUserId]);

        if (updateResults.rowCount === 0) {
            throw new Error("User not found or username already exists.");
        }

        return updateResults.rows[0];
    } catch (error) {
        console.error("Error updating username:", error.message);
        throw error;
    }
};


module.exports.getUserInfo = (user_id) => {
    const sql = `SELECT username, email, profile_pic FROM users WHERE user_id = $1`;
    return query(sql, [user_id]).then(function (result) {
        const rows = result.rows;
        if (rows.length === 0) {
            throw new Error(`no such user`);
        }
        return rows[0];
    });
}