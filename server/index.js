const express = require('express');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const runningLocal = !!process.env.REACT_APP_LOCAL;
console.log('runningLocal', runningLocal);
const port = runningLocal ? 8080 : 3000;
console.log('port', port);

const server = app.listen(port);

const players = [
  {
    id: 'clicker',
    connected: false,
    label: 'Click the button (sounds easy, right?)',
    socket: null,
  },
  {
    id: 'antagonist',
    connected: false,
    label: 'Be a pain in the ass to the other player...',
    socket: null,
  }
];

if (!runningLocal) {
  // Serve static assets
  app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Always return the main index.html, so react-router render the route in the client
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  });
}

const io = socketio(server);

io.on('connection', (socket) => {
  console.log(' **** USER CONNECTED ****', socket.id);
  socket.emit('new connection', players);

  socket.on('disconnect', () => {
    console.log('**** USER DISCONNECTED ****', socket.id);

    const numberConnected = players.filter(player => !!player.connected).length;
    if (numberConnected === 2) {
      players.forEach(player => {
        player.connected = false;
        player.socket = null;
      });
      return socket.broadcast.emit('reset game', true);
    }
    const player = players.find(player => player.socket === socket.id);
    // user could disconnect / close browser before selecting player...
    if (player) {
      player.connected = false;
      player.socket = null;
      socket.broadcast.emit('player disconnected', player.id, true);
    }
  });

  socket.on('update game option event', gameOptionPayload => {
    socket.broadcast.emit('new gameState', gameOptionPayload);
  });

  socket.on('player selected event', playerId => {
    const player = players.find(player => player.id === playerId);
    player.connected = true;
    player.socket = socket.id;
    console.log('*** PLAYER SELECTED ***', player);
    socket.broadcast.emit('new player selected', playerId);
  });

  socket.on('reset game event', resetPlayers => {
    socket.broadcast.emit('reset game', resetPlayers);
  });

  socket.on('hide element event', elementId => {
    socket.broadcast.emit('hide element', elementId);
  });
})