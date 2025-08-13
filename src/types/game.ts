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
  type: 'public' | 'private';
  createdAt: number;
  lifetime: number;
}

export interface Area {
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

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  type: 'star_scarcity' | 'star_abundance' | 'zone_boost' | 'speed_boost';
  target: 'public' | 'private' | 'all';
  effect: {
    starSpawnMultiplier?: number;
    starLifetimeMultiplier?: number;
    playerSpeedMultiplier?: number;
  };
  duration: number; // in seconds
}

export interface GameRound {
  number: number;
  duration: number; // 5 minutes = 300 seconds
  events: GameEvent[];
  startTime: number;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  type: 'global' | 'zone' | 'private';
}

export interface GameMap {
  id: string;
  name: string;
  width: number;
  height: number;
  areas: Area[];
}

export interface GameState {
  players: Player[];
  stars: Star[];
  currentMap: GameMap;
  chatMessages: ChatMessage[];
  currentPlayer: Player | null;
  currentRound: GameRound | null;
  totalRounds: number;
  gameStatus: 'waiting' | 'playing' | 'ended';
  activeEvents: GameEvent[];
}