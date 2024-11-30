const express = require('express');

const routes = require('./routes/routes.js');
const accountRoutes = require('./routes/accountRoutes.js');
const mainRoutes = require('./routes/mainRoutes.js');
const groupRoutes = require('./routes/groupRoutes.js');
const  ocrRoutes = require('./routes/OCRroutes.js');
const groupstudyRoutes = require("./routes/groupstudyRoutes.js")
const forumRoutes = require("./routes/forumRoutes.js")

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))

app.use(express.json());
app.use(express.raw({ type: 'application/json' }));

app.use(express.static('public'));


app.use('/', routes)
app.use('/account', accountRoutes)
app.use('/main', mainRoutes)
app.use('/groups', groupRoutes)
app.use('/ocr', ocrRoutes); // Add the endpoint for flashcards
app.use('/study', groupstudyRoutes); // Add the endpoint for flashcards
app.use('/forum', forumRoutes)


module.exports = app;