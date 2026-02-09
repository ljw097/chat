const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*"}
    });

require('./socket')(io);

server.listen(3000, () => {
    console.log('Chat server listening on port 3000');
});


