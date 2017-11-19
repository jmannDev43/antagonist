const express = require('express');
const socketio = require('socket.io')

const app = express();
const port = 8080

const server = app.listen(port);

const players = [
  {id: 'clicker', connected: false, label: 'Click the button (sounds easy, right?)'},
  {id: 'antagonist', connected: false, label: 'Be a pain in the ass to the other player...'}
];


const io = socketio(server)

io.on('connection', (socket) => {
  console.log('user connected', new Date().toLocaleDateString());
  socket.emit('new connection', players);
  socket.on('disconnect', () => {
    players.forEach(player => player.connected = false);
    console.log('user disconnected', new Date().toLocaleDateString());
    socket.broadcast.emit('new disconnection', players);
  });
  socket.on('update game option event', payload => {
    socket.broadcast.emit('new gameState', payload);
  });
  socket.on('playAs event', payload => {
    const player = players.find(player => player.id === payload);
    player.connected = true;
    socket.broadcast.emit('new player selected', payload);
  });
  socket.on('reset game event', payload => {
    socket.broadcast.emit('reset game', payload);
  });
  socket.on('hide element event', payload => {
    socket.broadcast.emit('hide element', payload);
  });
})