
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  score: number;
  color: string;
  zone: string;
  isOnline: boolean;
}

export interface Star {
  id: string;
  x: number;
  y: number;
  zone: string;
  createdAt: number;
  lifetime: number;
}

export interface Zone {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'public' | 'private';
  playerCount: number;
  starSpawnRate: number;
  color: string;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  type: 'global' | 'zone' | 'private';
}

interface GameContextType {
  players: Player[];
  stars: Star[];
  zones: Zone[];
  chatMessages: ChatMessage[];
  currentPlayer: Player | null;
  gameTime: number;
  gameStatus: 'waiting' | 'playing' | 'ended';
  movePlayer: (direction: 'up' | 'down' | 'left' | 'right') => void;
  collectStar: (starId: string) => void;
  sendMessage: (message: string, type: 'global' | 'zone') => void;
  startGame: () => void;
  joinGame: (playerName: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameTime, setGameTime] = useState(300); // 5 minutes
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'ended'>('waiting');

  // Define game zones
  const zones: Zone[] = [
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

  const getPlayerZone = (x: number, y: number): string => {
    for (const zone of zones) {
      if (x >= zone.x && x <= zone.x + zone.width && 
          y >= zone.y && y <= zone.y + zone.height) {
        return zone.id;
      }
    }
    return 'wilderness';
  };

  const joinGame = useCallback((playerName: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: playerName,
      x: 300,
      y: 300,
      score: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      zone: getPlayerZone(300, 300),
      isOnline: true
    };

    setCurrentPlayer(newPlayer);
    setPlayers(prev => [...prev, newPlayer]);
  }, []);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!currentPlayer || gameStatus !== 'playing') return;

    const moveDistance = 10;
    let newX = currentPlayer.x;
    let newY = currentPlayer.y;

    switch (direction) {
      case 'up':
        newY = Math.max(0, currentPlayer.y - moveDistance);
        break;
      case 'down':
        newY = Math.min(600, currentPlayer.y + moveDistance);
        break;
      case 'left':
        newX = Math.max(0, currentPlayer.x - moveDistance);
        break;
      case 'right':
        newX = Math.min(800, currentPlayer.x + moveDistance);
        break;
    }

    const newZone = getPlayerZone(newX, newY);
    const updatedPlayer = { ...currentPlayer, x: newX, y: newY, zone: newZone };

    setCurrentPlayer(updatedPlayer);
    setPlayers(prev => prev.map(p => p.id === currentPlayer.id ? updatedPlayer : p));
  }, [currentPlayer, gameStatus]);

  const collectStar = useCallback((starId: string) => {
    if (!currentPlayer) return;

    const star = stars.find(s => s.id === starId);
    if (!star) return;

    const distance = Math.sqrt(
      Math.pow(currentPlayer.x - star.x, 2) + Math.pow(currentPlayer.y - star.y, 2)
    );

    if (distance <= 30) {
      setStars(prev => prev.filter(s => s.id !== starId));
      const updatedPlayer = { ...currentPlayer, score: currentPlayer.score + 1 };
      setCurrentPlayer(updatedPlayer);
      setPlayers(prev => prev.map(p => p.id === currentPlayer.id ? updatedPlayer : p));
    }
  }, [currentPlayer, stars]);

  const sendMessage = useCallback((message: string, type: 'global' | 'zone') => {
    if (!currentPlayer) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      message,
      timestamp: Date.now(),
      type
    };

    setChatMessages(prev => [...prev, newMessage].slice(-50)); // Keep last 50 messages
  }, [currentPlayer]);

  const startGame = useCallback(() => {
    setGameStatus('playing');
    setGameTime(300);
  }, []);

  // Game loop - spawn stars and update game state
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const interval = setInterval(() => {
      // Update player counts in zones
      const updatedZones = zones.map(zone => ({
        ...zone,
        playerCount: players.filter(p => p.zone === zone.id).length
      }));

      // Spawn new stars
      setStars(prev => {
        const newStars = [...prev];
        
        updatedZones.forEach(zone => {
          const shouldSpawn = Math.random() < (zone.starSpawnRate / 100);
          const decayRate = Math.max(0.1, 1 - (zone.playerCount * 0.2));
          
          if (shouldSpawn && Math.random() < decayRate) {
            const newStar: Star = {
              id: Date.now().toString() + Math.random(),
              x: zone.x + Math.random() * zone.width,
              y: zone.y + Math.random() * zone.height,
              zone: zone.id,
              createdAt: Date.now(),
              lifetime: zone.type === 'public' ? 15000 - (zone.playerCount * 2000) : 25000
            };
            newStars.push(newStar);
          }
        });

        // Remove expired stars
        return newStars.filter(star => 
          Date.now() - star.createdAt < star.lifetime
        );
      });

      // Update game timer
      setGameTime(prev => {
        if (prev <= 1) {
          setGameStatus('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus, players]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;
      
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          movePlayer('up');
          break;
        case 's':
        case 'arrowdown':
          movePlayer('down');
          break;
        case 'a':
        case 'arrowleft':
          movePlayer('left');
          break;
        case 'd':
        case 'arrowright':
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer, gameStatus]);

  return (
    <GameContext.Provider value={{
      players,
      stars,
      zones,
      chatMessages,
      currentPlayer,
      gameTime,
      gameStatus,
      movePlayer,
      collectStar,
      sendMessage,
      startGame,
      joinGame
    }}>
      {children}
    </GameContext.Provider>
  );
};
