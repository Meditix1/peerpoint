const { query } = require('../database');
const pool = require('../database.js')

const { configDotenv } = require('dotenv');

// ------------------------- Functions ------------------------------///

// Example function to check if a user exists
module.exports.test = function test() {
    const sql = 'SELECT * FROM test';
    console.log('Executing query:', sql);
    return query(sql);
}