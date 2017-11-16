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
  socket.on('update game option event', payload => {
    socket.broadcast.emit('new gameState', payload);
  });
  socket.on('playAs event', payload => {
    socket.broadcast.emit('new player selected', payload);
  });
  socket.on('reset game event', () => {
    socket.broadcast.emit('reset game');
  });
})