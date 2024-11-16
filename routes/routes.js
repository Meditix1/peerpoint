// See https://expressjs.com/en/guide/routing.html for routing

const express = require('express');
const bcrypt = require('bcrypt');
const natural = require('natural');
const stemmer = natural.PorterStemmer;
const tokenizer = new natural.WordTokenizer();


const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR, TABLE_ALREADY_EXISTS_ERROR } = require('../errors');
const modulesModel = require('../models/modules');
const router = express.Router();



module.exports = router;