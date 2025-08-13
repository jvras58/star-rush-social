import { GameEvent } from '../types/game';

// Predefined game events
const GAME_EVENTS: GameEvent[] = [
  {
    id: 'public_scarcity',
    name: 'Escassez Pública',
    description: 'As estrelas azuis ficaram mais raras nas áreas públicas',
    type: 'star_scarcity',
    target: 'public',
    effect: {
      starSpawnMultiplier: 0.3
    },
    duration: 180 // 3 minutes
  },
  {
    id: 'private_abundance',
    name: 'Abundância Privada',
    description: 'Chuva de estrelas amarelas nas áreas privadas!',
    type: 'star_abundance',
    target: 'private',
    effect: {
      starSpawnMultiplier: 2.5
    },
    duration: 120 // 2 minutes
  },
  {
    id: 'public_boost',
    name: 'Impulso Público',
    description: 'Estrelas azuis duram mais tempo nas áreas públicas',
    type: 'zone_boost',
    target: 'public',
    effect: {
      starLifetimeMultiplier: 1.5
    },
    duration: 150 // 2.5 minutes
  },
  {
    id: 'private_scarcity',
    name: 'Seca Privada',
    description: 'Estrelas amarelas quase desapareceram das áreas privadas',
    type: 'star_scarcity',
    target: 'private',
    effect: {
      starSpawnMultiplier: 0.2
    },
    duration: 90 // 1.5 minutes
  },
  {
    id: 'speed_surge',
    name: 'Onda de Velocidade',
    description: 'Todos os jogadores se movem mais rapidamente!',
    type: 'speed_boost',
    target: 'all',
    effect: {
      playerSpeedMultiplier: 1.5
    },
    duration: 60 // 1 minute
  },
  {
    id: 'golden_hour',
    name: 'Hora Dourada',
    description: 'Estrelas amarelas aparecem em todas as áreas!',
    type: 'star_abundance',
    target: 'all',
    effect: {
      starSpawnMultiplier: 1.8
    },
    duration: 100 // 1.67 minutes
  }
];

// Generate random events for a round
export const generateRoundEvents = (roundNumber: number): GameEvent[] => {
  const maxEvents = Math.min(2, Math.floor(roundNumber / 2) + 1); // 1-2 events per round, increasing with round number
  const eventCount = Math.floor(Math.random() * maxEvents) + 1;
  
  const selectedEvents: GameEvent[] = [];
  const availableEvents = [...GAME_EVENTS];
  
  for (let i = 0; i < eventCount && availableEvents.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableEvents.length);
    const event = { ...availableEvents[randomIndex] };
    
    // Add some randomization to event timing
    const delayOffset = Math.floor(Math.random() * 120); // 0-2 minutes delay
    event.duration = Math.max(30, event.duration + (Math.random() - 0.5) * 60); // ±30 seconds variation
    
    selectedEvents.push(event);
    availableEvents.splice(randomIndex, 1); // Remove to avoid duplicates
  }
  
  return selectedEvents;
};

// Calculate event effects on spawn rates
export const calculateSpawnRateModifier = (
  areaType: 'public' | 'private',
  activeEvents: GameEvent[]
): number => {
  let modifier = 1;
  
  activeEvents.forEach(event => {
    if (event.target === areaType || event.target === 'all') {
      if (event.effect.starSpawnMultiplier) {
        modifier *= event.effect.starSpawnMultiplier;
      }
    }
  });
  
  return modifier;
};

// Calculate event effects on star lifetime
export const calculateLifetimeModifier = (
  areaType: 'public' | 'private',
  activeEvents: GameEvent[]
): number => {
  let modifier = 1;
  
  activeEvents.forEach(event => {
    if (event.target === areaType || event.target === 'all') {
      if (event.effect.starLifetimeMultiplier) {
        modifier *= event.effect.starLifetimeMultiplier;
      }
    }
  });
  
  return modifier;
};

// Calculate event effects on player speed
export const calculateSpeedModifier = (activeEvents: GameEvent[]): number => {
  let modifier = 1;
  
  activeEvents.forEach(event => {
    if (event.target === 'all' && event.effect.playerSpeedMultiplier) {
      modifier *= event.effect.playerSpeedMultiplier;
    }
  });
  
  return modifier;
};