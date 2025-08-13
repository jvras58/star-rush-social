import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import socket from '../lib/socket';
import { 
  Player, 
  Star, 
  Area, 
  ChatMessage, 
  GameMap, 
  GameRound, 
  GameEvent, 
  GameState 
} from '../types/game';
import { loadMapFromFile, getDefaultMap } from '../utils/mapLoader';
import { 
  generateRoundEvents, 
  calculateSpawnRateModifier, 
  calculateLifetimeModifier,
  calculateSpeedModifier 
} from '../utils/gameEvents';

interface GameContextType {
  players: Player[];
  stars: Star[];
  areas: Area[];
  chatMessages: ChatMessage[];
  currentPlayer: Player | null;
  currentRound: GameRound | null;
  totalRounds: number;
  gameStatus: 'waiting' | 'playing' | 'ended';
  activeEvents: GameEvent[];
  currentMap: GameMap;
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
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
  const [totalRounds] = useState(6); // 6 rounds total
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'ended'>('waiting');
  const [activeEvents, setActiveEvents] = useState<GameEvent[]>([]);
  const [currentMap, setCurrentMap] = useState<GameMap>(getDefaultMap());

  const getPlayerZone = (x: number, y: number): string => {
    for (const area of currentMap.areas) {
      if (x >= area.x && x <= area.x + area.width && 
          y >= area.y && y <= area.y + area.height) {
        return area.id;
      }
    }
    return 'wilderness';
  };

  const startNewRound = (roundNumber: number) => {
    const events = generateRoundEvents(roundNumber);
    const newRound: GameRound = {
      number: roundNumber,
      duration: 300, // 5 minutes per round
      events,
      startTime: Date.now()
    };
    setCurrentRound(newRound);
    setActiveEvents([]);
    
    // Schedule events to start at random times during the round
    events.forEach((event, index) => {
      const delay = Math.random() * 150000; // 0-2.5 minutes delay
      setTimeout(() => {
        setActiveEvents(prev => [...prev, event]);
        
        // Remove event after its duration
        setTimeout(() => {
          setActiveEvents(prev => prev.filter(e => e.id !== event.id));
        }, event.duration * 1000);
      }, delay);
    });
  };

  const joinGame = useCallback((playerName: string) => {
    socket.emit('player:join', playerName);
  }, []);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    socket.emit('player:move', direction);
  }, []);

  const collectStar = useCallback((starId: string) => {
    socket.emit('star:collect', starId);
  }, []);

  const sendMessage = useCallback((message: string, type: 'global' | 'zone') => {
    socket.emit('chat:message', { message, type });
  }, []);

  const startGame = useCallback(() => {
    startNewRound(1);
    setGameStatus('playing');
    socket.emit('game:start');
  }, []);

  // Load map on component mount
  useEffect(() => {
    const loadMap = async () => {
      try {
        const map = await loadMapFromFile('/maps/default.xml');
        setCurrentMap(map);
      } catch (error) {
        console.error('Failed to load map, using default:', error);
        setCurrentMap(getDefaultMap());
      }
    };
    loadMap();
  }, []);

  useEffect(() => {
    if (socket.connected) return;
    socket.connect();

    socket.on('state', ({ players, stars, gameStatus, currentRound }) => {
      setPlayers(players);
      setStars(stars);
      setGameStatus(gameStatus);
      if (currentRound) {
        setCurrentRound(currentRound);
      }
    });

    socket.on('chat:message', (msg: ChatMessage) => {
      setChatMessages(prev => [...prev, msg].slice(-50));
    });

    socket.on('player:self', (player: Player) => {
      setCurrentPlayer(player);
    });

    return () => {
      socket.off('state');
      socket.off('chat:message');
      socket.off('player:self');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (gameStatus !== 'playing' || !currentRound) return;

    const interval = setInterval(() => {
      // Update player counts in areas
      const updatedAreas = currentMap.areas.map(area => ({
        ...area,
        playerCount: players.filter(p => p.zone === area.id).length
      }));

      // Update current map with player counts
      setCurrentMap(prev => ({
        ...prev,
        areas: updatedAreas
      }));

      // Spawn new stars
      setStars(prev => {
        const newStars = [...prev];
        
        updatedAreas.forEach(area => {
          const spawnRateModifier = calculateSpawnRateModifier(area.type, activeEvents);
          const adjustedSpawnRate = area.starSpawnRate * spawnRateModifier;
          const shouldSpawn = Math.random() < (adjustedSpawnRate / 100);
          const decayRate = Math.max(0.1, 1 - (area.playerCount * 0.2));
          
          if (shouldSpawn && Math.random() < decayRate) {
            const lifetimeModifier = calculateLifetimeModifier(area.type, activeEvents);
            const baseLifetime = area.type === 'public' ? 12000 : 20000;
            const adjustedLifetime = baseLifetime * lifetimeModifier - (area.playerCount * 1500);
            
            const newStar: Star = {
              id: Date.now().toString() + Math.random(),
              x: area.x + Math.random() * area.width,
              y: area.y + Math.random() * area.height,
              zone: area.id,
              type: area.type,
              createdAt: Date.now(),
              lifetime: Math.max(5000, adjustedLifetime)
            };
            newStars.push(newStar);
          }
        });

        // Remove expired stars
        return newStars.filter(star => 
          Date.now() - star.createdAt < star.lifetime
        );
      });

      // Update round timer
      if (currentRound) {
        const elapsed = Date.now() - currentRound.startTime;
        const remaining = currentRound.duration * 1000 - elapsed;
        
        if (remaining <= 0) {
          if (currentRound.number >= totalRounds) {
            setGameStatus('ended');
            setCurrentRound(null);
          } else {
            startNewRound(currentRound.number + 1);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus, currentRound, players, activeEvents, currentMap, totalRounds]);

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
      areas: currentMap.areas,
      chatMessages,
      currentPlayer,
      currentRound,
      totalRounds,
      gameStatus,
      activeEvents,
      currentMap,
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
