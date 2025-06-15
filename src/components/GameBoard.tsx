
import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Sparkles, Crown, Users } from 'lucide-react';

const GameBoard = () => {
  const { players, stars, zones, currentPlayer, collectStar, gameStatus } = useGame();

  const handleStarClick = (starId: string) => {
    collectStar(starId);
  };

  if (gameStatus === 'waiting') {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <Sparkles className="text-yellow-300/30" size={20 + Math.random() * 20} />
            </div>
          ))}
        </div>
        
        <div className="text-center text-white z-10 bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30">
          <div className="text-8xl mb-6 animate-pulse">⭐</div>
          <h2 className="text-3xl mb-4 font-bold text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text">
            Aguardando Aventureiros...
          </h2>
          <p className="text-lg opacity-75 mb-4">
            Use <kbd className="bg-white/20 px-2 py-1 rounded">WASD</kbd> ou <kbd className="bg-white/20 px-2 py-1 rounded">setas</kbd> para se mover
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-yellow-200">
            <Sparkles size={16} />
            <span>A aventura está prestes a começar!</span>
            <Sparkles size={16} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 overflow-hidden">
      {/* Game zones with enhanced visuals */}
      {zones.map(zone => (
        <div
          key={zone.id}
          className="absolute border-2 border-white/40 rounded-xl backdrop-blur-sm transition-all duration-300 hover:border-yellow-400/60 shadow-lg"
          style={{
            left: zone.x,
            top: zone.y,
            width: zone.width,
            height: zone.height,
            backgroundColor: zone.color,
            boxShadow: zone.type === 'public' ? '0 0 20px rgba(255, 215, 0, 0.3)' : '0 0 15px rgba(147, 51, 234, 0.3)'
          }}
        >
          <div className="absolute -top-8 left-3 flex items-center gap-2">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/20">
              <span className="text-white text-sm font-bold">{zone.name}</span>
              <div className="flex items-center gap-1 mt-1">
                <Users size={12} className="text-white/60" />
                <span className="text-xs text-white/80">{zone.playerCount}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/20">
            <span className="text-xs text-white flex items-center gap-1">
              {zone.type === 'public' ? (
                <>
                  <Sparkles size={12} className="text-yellow-400" />
                  <span className="text-yellow-300">Público</span>
                </>
              ) : (
                <>
                  <Crown size={12} className="text-purple-400" />
                  <span className="text-purple-300">Privado</span>
                </>
              )}
            </span>
          </div>
        </div>
      ))}

      {/* Enhanced stars with glow effect */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-150 group"
          style={{
            left: star.x,
            top: star.y,
          }}
          onClick={() => handleStarClick(star.id)}
        >
          <div className="relative">
            <div className="w-8 h-8 text-4xl animate-pulse hover:animate-bounce transition-all duration-200 group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">
              ⭐
            </div>
            <div className="absolute inset-0 w-8 h-8 bg-yellow-300/20 rounded-full animate-ping"></div>
          </div>
        </div>
      ))}

      {/* Enhanced players */}
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
            className={`w-10 h-10 rounded-full border-3 ${
              player.id === currentPlayer?.id 
                ? 'border-yellow-400 ring-4 ring-yellow-400/50 shadow-lg shadow-yellow-400/30' 
                : 'border-white/80 shadow-lg'
            } flex items-center justify-center text-lg font-bold text-white transition-all duration-200 hover:scale-110`}
            style={{ 
              backgroundColor: player.color,
              boxShadow: player.id === currentPlayer?.id 
                ? `0 0 20px ${player.color}80, 0 0 40px rgba(255, 215, 0, 0.3)` 
                : `0 0 15px ${player.color}80`
            }}
          >
            {player.name.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/20 shadow-lg">
            <div className="text-xs text-white font-medium whitespace-nowrap flex items-center gap-1">
              <span>{player.name}</span>
              <span className="text-yellow-400">({player.score} ⭐)</span>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced UI elements */}
      <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-2xl">
        <div className="text-white/90 text-sm space-y-2">
          <div className="flex items-center gap-2 font-semibold text-yellow-300 mb-2">
            <Sparkles size={16} />
            <span>Controles</span>
          </div>
          <p className="flex items-center gap-2">
            <kbd className="bg-white/20 px-2 py-1 rounded text-xs">WASD</kbd>
            <span className="text-white/70">ou</span>
            <kbd className="bg-white/20 px-2 py-1 rounded text-xs">↑↓←→</kbd>
            <span>para mover</span>
          </p>
          <p>
            <span className="text-yellow-300">Clique nas ⭐</span> para coletar
          </p>
        </div>
      </div>

      {/* Enhanced zone legend */}
      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-2xl max-w-xs">
        <div className="text-white">
          <div className="flex items-center gap-2 font-semibold text-yellow-300 mb-3">
            <Crown size={16} />
            <span>Guia das Zonas</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-yellow-400 flex-shrink-0" />
              <span><strong className="text-yellow-300">Públicas:</strong> Mais estrelas, menos duração</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown size={14} className="text-purple-400 flex-shrink-0" />
              <span><strong className="text-purple-300">Privadas:</strong> Menos estrelas, mais duração</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-blue-400 flex-shrink-0" />
              <span><strong className="text-blue-300">Números:</strong> jogadores na zona</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
