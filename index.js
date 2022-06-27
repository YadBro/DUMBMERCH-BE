const express = require("express");

const router = require("./src/routes");
const app = express();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
app.use(cors());
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000' //define client origin if both client and server have different origin
    }
});
require('./src/socket')(io);


// cors

// izinkan sebuah input data jadi json
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/assets', express.static('assets'));

// Create endpoint grouping routes
app.use('/api/v1/', router);

app.get('/', function (req, res) {
    res.send({
        message: 'Hello World'
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});