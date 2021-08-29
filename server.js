const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const fs = require('fs')
const port = process.env.PORT || 4000
const io = require('socket.io')(port, {
    cors: {
        origin: '*',
    }
    });
    app.use(express.static('public'))
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});
const users ={}
io.on('connection', socket => {
    socket.on('new-user', naam =>{
        users[socket.id] = naam
        socket.broadcast.emit('user-connected', naam)
    })
    socket.on('send-chat-message', message =>{
        socket.broadcast.emit('chat-message', {message: message, naam:users[socket.id]})
    })
    socket.on('disconnect', () =>{
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})

app.use('/', router);
app.listen(process.env.port + 1 || 3000);
console.log('Running at Port 3000');
