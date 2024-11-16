const express = require('express');


const app = express();


app.use(express.json()); // to process JSON in request body
app.use(express.raw({ type: 'application/json' }));

app.use(express.static('public'));


module.exports = app;   