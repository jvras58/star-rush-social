
import React from 'react';
import { useGame } from '../contexts/GameContext';

const GameBoard = () => {
  const { players, stars, zones, currentPlayer, collectStar, gameStatus } = useGame();

  const handleStarClick = (starId: string) => {
    collectStar(starId);
  };

  if (gameStatus === 'waiting') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl mb-4">Aguardando jogadores...</h2>
          <p className="text-lg opacity-75">
            Use WASD ou setas para se mover quando o jogo começar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
      {/* Game zones */}
      {zones.map(zone => (
        <div
          key={zone.id}
          className="absolute border-2 border-white/30 rounded-lg backdrop-blur-sm"
          style={{
            left: zone.x,
            top: zone.y,
            width: zone.width,
            height: zone.height,
            backgroundColor: zone.color,
          }}
        >
          <div className="absolute -top-6 left-2 text-white text-sm font-semibold">
            {zone.name} ({zone.playerCount})
          </div>
          <div className="absolute top-2 right-2 text-xs text-white/60">
            {zone.type === 'public' ? '🌟 Público' : '🔒 Privado'}
          </div>
        </div>
      ))}

      {/* Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 animate-pulse hover:scale-125 transition-transform"
          style={{
            left: star.x,
            top: star.y,
          }}
          onClick={() => handleStarClick(star.id)}
        >
          <div className="w-6 h-6 text-yellow-300 hover:text-yellow-100 transition-colors">
            ⭐
          </div>
        </div>
      ))}

      {/* Players */}
      {players.map(player => (
        <div
          key={player.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
          style={{
            left: player.x,
            top: player.y,
          }}
        >
          <div
            className={`w-8 h-8 rounded-full border-2 ${
              player.id === currentPlayer?.id ? 'border-white ring-2 ring-yellow-400' : 'border-white/60'
            } flex items-center justify-center text-sm font-bold text-white shadow-lg`}
            style={{ backgroundColor: player.color }}
          >
            {player.name.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/50 px-2 py-1 rounded whitespace-nowrap">
            {player.name} ({player.score})
          </div>
        </div>
      ))}

      {/* Game instructions */}
      <div className="absolute bottom-4 left-4 text-white/60 text-sm">
        <p>Use WASD ou setas para mover</p>
        <p>Clique nas ⭐ para coletar</p>
      </div>

      {/* Zone legend */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
        <h3 className="font-semibold mb-2">Zonas:</h3>
        <div className="space-y-1 text-xs">
          <div>🌟 Públicas: Mais estrelas, menos duração</div>
          <div>🔒 Privadas: Menos estrelas, mais duração</div>
          <div>👥 Números = jogadores na zona</div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
