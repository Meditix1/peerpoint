const express = require('express');

const routes = require('./routes/routes.js');
const accountRoutes = require('./routes/accountRoutes.js');
const mainRoutes = require('./routes/mainRoutes.js');

const app = express();


app.use(express.json()); // to process JSON in request body
app.use(express.raw({ type: 'application/json' }));

app.use(express.static('public'));

app.use('/', routes)
app.use('/account', accountRoutes)
app.use('/main', mainRoutes)

module.exports = app;