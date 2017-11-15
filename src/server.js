const express = require('express');
const socketio = require('socket.io')

const app = express();
const port = 8080

const server = app.listen(port);

const io = socketio(server)

io.on('connection', (socket) => {
  console.log('user connected', new Date().toLocaleDateString());
  socket.on('disconnect', () => {
    console.log('user disconnected', new Date().toLocaleDateString());
  });
  socket.on('buttonPosition event', (data) => {
    socket.broadcast.emit('new buttonPosition', data);
  });
  socket.on('playAs event', (data) => {
    socket.broadcast.emit('new player selected', data);
  });
})