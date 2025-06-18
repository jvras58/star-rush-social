import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const PORT = process.env.PORT || 4000;

// ----- Game constants -----
const INITIAL_TIME = 300; // 5 minutes
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

// Zones must match the client definition
const zones = [
  {
    id: 'central-plaza',
    name: 'Praça Central',
    x: 200,
    y: 200,
    width: 200,
    height: 200,
    type: 'public',
    playerCount: 0,
    starSpawnRate: 5,
    color: 'rgba(255, 215, 0, 0.3)'
  },
  {
    id: 'north-gardens',
    name: 'Jardins do Norte',
    x: 100,
    y: 50,
    width: 150,
    height: 120,
    type: 'public',
    playerCount: 0,
    starSpawnRate: 3,
    color: 'rgba(0, 255, 127, 0.3)'
  },
  {
    id: 'east-caverns',
    name: 'Cavernas do Leste',
    x: 450,
    y: 150,
    width: 120,
    height: 180,
    type: 'private',
    playerCount: 0,
    starSpawnRate: 2,
    color: 'rgba(138, 43, 226, 0.3)'
  },
  {
    id: 'south-fields',
    name: 'Campos do Sul',
    x: 150,
    y: 450,
    width: 180,
    height: 100,
    type: 'public',
    playerCount: 0,
    starSpawnRate: 4,
    color: 'rgba(255, 69, 0, 0.3)'
  },
  {
    id: 'west-woods',
    name: 'Bosque Oeste',
    x: 50,
    y: 250,
    width: 120,
    height: 150,
    type: 'private',
    playerCount: 0,
    starSpawnRate: 2,
    color: 'rgba(34, 139, 34, 0.3)'
  }
];

// ----- In-memory state -----
const players = new Map(); // socket.id -> player
let stars = [];
let gameTime = INITIAL_TIME;
let gameStatus = 'waiting'; // 'waiting' | 'playing' | 'ended'

const chatMessages = [];

// ----- Helpers -----
function broadcastState(io) {
  io.emit('state', {
    players: Array.from(players.values()),
    stars,
    gameTime,
    gameStatus
  });
}

function getPlayerZone(x, y) {
  for (const z of zones) {
    if (x >= z.x && x <= z.x + z.width && y >= z.y && y <= z.y + z.height) {
      return z.id;
    }
  }
  return 'wilderness';
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Star spawning loop (runs while gameStatus === 'playing')
function startGameLoop(io) {
  const interval = setInterval(() => {
    if (gameStatus !== 'playing') return; // pause if ended

    // Update zone player counts
    zones.forEach(z => {
      z.playerCount = Array.from(players.values()).filter(p => p.zone === z.id).length;
    });

    // Spawn stars
    zones.forEach(zone => {
      const shouldSpawn = Math.random() < zone.starSpawnRate / 100;
      const decayRate = Math.max(0.1, 1 - zone.playerCount * 0.2);
      if (shouldSpawn && Math.random() < decayRate) {
        stars.push({
          id: Date.now().toString() + Math.random(),
          x: randomInt(zone.x, zone.x + zone.width),
          y: randomInt(zone.y, zone.y + zone.height),
          zone: zone.id,
          createdAt: Date.now(),
          lifetime: zone.type === 'public' ? 15000 - zone.playerCount * 2000 : 25000
        });
      }
    });

    // Remove expired stars
    stars = stars.filter(star => Date.now() - star.createdAt < star.lifetime);

    // Countdown
    if (gameTime > 0) {
      gameTime -= 1;
    } else {
      gameStatus = 'ended';
    }

    broadcastState(io);
  }, 1000);

  return interval;
}

// ----- Server setup -----
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

let loopHandle = null;

io.on('connection', socket => {
  console.log('⚡ New client', socket.id);

  // Send current state immediately
  broadcastState(socket);

  // --- Event listeners ---
  socket.on('player:join', name => {
    const player = {
      id: socket.id,
      name: name || 'Anônimo',
      x: 300,
      y: 300,
      score: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      zone: getPlayerZone(300, 300),
      isOnline: true
    };
    players.set(socket.id, player);
    socket.emit('player:self', player);
    broadcastState(io);
  });

  socket.on('player:move', dir => {
    const p = players.get(socket.id);
    if (!p || gameStatus !== 'playing') return;
    const moveDistance = 10;
    switch (dir) {
      case 'up':
        p.y = Math.max(0, p.y - moveDistance);
        break;
      case 'down':
        p.y = Math.min(600, p.y + moveDistance);
        break;
      case 'left':
        p.x = Math.max(0, p.x - moveDistance);
        break;
      case 'right':
        p.x = Math.min(800, p.x + moveDistance);
        break;
    }
    p.zone = getPlayerZone(p.x, p.y);

    const collected = [];
    stars = stars.filter(star => {
      const dist = Math.hypot(p.x - star.x, p.y - star.y);
      if (dist <= 30) {
        p.score += 1;
        collected.push(star.id);
        return false;
      }
      return true;
    });

    if (collected.length) {
      console.log(`Player ${p.name} collected ${collected.length} star(s)`);
    }

    broadcastState(io);
  });

  socket.on('star:collect', starId => {
    const p = players.get(socket.id);
    if (!p) return;
    const star = stars.find(s => s.id === starId);
    if (!star) return;
    const distance = Math.hypot(p.x - star.x, p.y - star.y);
    if (distance <= 30) {
      stars = stars.filter(s => s.id !== starId);
      p.score += 1;
      broadcastState(io);
    }
  });

  socket.on('chat:message', ({ message, type }) => {
    const p = players.get(socket.id);
    if (!p) return;
    const chat = {
      id: Date.now().toString(),
      playerId: p.id,
      playerName: p.name,
      message,
      timestamp: Date.now(),
      type: type || 'global'
    };
    chatMessages.push(chat);
    io.emit('chat:message', chat);
  });

  socket.on('game:start', () => {
    if (gameStatus === 'playing') return;
    gameStatus = 'playing';
    gameTime = INITIAL_TIME;
    if (!loopHandle) loopHandle = startGameLoop(io);
    broadcastState(io);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected', socket.id);
    players.delete(socket.id);
    broadcastState(io);
  });
});

// Basic health route
app.get('/', (req, res) => res.send('Star-Rush server is running'));

server.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
