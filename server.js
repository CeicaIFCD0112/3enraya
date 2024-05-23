const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

let players = {};

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join', (data) => {
    if (!players.player1) {
      players.player1 = data.name;
      socket.player = 'X';
    } else if (!players.player2) {
      players.player2 = data.name;
      socket.player = 'O';
    }
    io.emit('joined', players);
  });

  socket.on('move', (data) => {
    io.emit('move', { index: data.index, player: socket.player });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    if (socket.player === 'X') {
      delete players.player1;
    } else if (socket.player === 'O') {
      delete players.player2;
    }
    io.emit('joined', players);
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
