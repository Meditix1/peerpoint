require('dotenv').config();
const app = require('./app');
const socketIo = require('socket.io');
const cors = require('cors');
const http = require('http');

const port = process.env.PORT || 3000;
app.listen(port, function () {
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${port}`);
});

const socketServer = http.createServer();

const io = socketIo(socketServer, {
    cors: {
        origin: 'http://localhost:3000', // Allow requests from this origin
        methods: ['GET', 'POST'],
        credentials: true
    }
});

socketServer.listen(5000, function () {
    console.log(`Socket.IO server listening on port 5000`);
});

io.on('connection', socket => {
    // socket.emit('chat-message', 'Hello World');
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', message)
    })
});