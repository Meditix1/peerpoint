require('dotenv').config();
const app = require('./app');
const socketIo = require('socket.io');
const cors = require('cors');
const http = require('http');

const port = process.env.PORT || 3000;
app.listen(port, function () {
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

groups = {};
io.on('connection', socket => {
    console.log('A user connected:', socket.id);

    socket.on('join-group', groupId => {
        socket.join(groupId);
        if (!groups[groupId]) {
            groups[groupId] = [];
        }
        groups[groupId].push(socket.id);
        console.log(`User ${socket.id} joined group ${groupId}`);
    });

    socket.on('send-chat-message', ({ groupId, message, profilePic }) => {
        console.log(message)
        socket.to(groupId).emit('chat-message', { message, profilePic });
    });

    socket.on('disconnect', () => {
        console.log('User  disconnected:', socket.id);
        
        for (const groupId in groups) {
            groups[groupId] = groups[groupId].filter(id => id !== socket.id);
        }
    });
});