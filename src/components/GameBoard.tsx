
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
      <div className="h-full flex items-center justify-center relative overflow-hidden" 
           style={{
             backgroundImage: `url('/lovable-uploads/7ad9ed14-5ed6-4cd0-b755-66a02a018f29.png')`,
             backgroundSize: '64px 64px',
             backgroundRepeat: 'repeat',
             imageRendering: 'pixelated'
           }}>
        {/* Overlay para escurecer o fundo */}
        <div className="absolute inset-0 bg-black/60"></div>
        
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
              <div className="w-6 h-6 bg-yellow-400 rounded-full opacity-60" 
                   style={{ imageRendering: 'pixelated' }}>
                ⭐
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center text-white z-10 bg-black/80 backdrop-blur-sm rounded-2xl p-8 border-4 border-yellow-600" 
             style={{ 
               borderStyle: 'solid',
               borderImage: 'linear-gradient(45deg, #d97706, #f59e0b) 1'
             }}>
          <div className="text-8xl mb-6 animate-pulse filter drop-shadow-lg">⭐</div>
          <h2 className="text-3xl mb-4 font-bold text-yellow-300 pixel-font">
            Aguardando Aventureiros...
          </h2>
          <p className="text-lg opacity-75 mb-4 pixel-font">
            Use <kbd className="bg-amber-800 px-2 py-1 rounded border-2 border-amber-600">WASD</kbd> ou <kbd className="bg-amber-800 px-2 py-1 rounded border-2 border-amber-600">setas</kbd> para se mover
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-yellow-200">
            <Sparkles size={16} />
            <span className="pixel-font">A aventura está prestes a começar!</span>
            <Sparkles size={16} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden"
         style={{
           backgroundImage: `url('/lovable-uploads/7ad9ed14-5ed6-4cd0-b755-66a02a018f29.png')`,
           backgroundSize: '128px 128px',
           backgroundRepeat: 'repeat',
           imageRendering: 'pixelated'
         }}>
      
      {/* Overlay pattern for depth */}
      <div className="absolute inset-0 opacity-20"
           style={{
             backgroundImage: `url('/lovable-uploads/048b82c5-ca9b-48d9-b91e-9ce7ea80f22e.png')`,
             backgroundSize: '32px 32px',
             backgroundRepeat: 'repeat',
             imageRendering: 'pixelated'
           }}></div>

      {/* Game zones with pixel art styling */}
      {zones.map(zone => (
        <div
          key={zone.id}
          className="absolute border-4 transition-all duration-300 hover:border-yellow-400"
          style={{
            left: zone.x,
            top: zone.y,
            width: zone.width,
            height: zone.height,
            backgroundColor: zone.color + '40',
            borderColor: zone.type === 'public' ? '#f59e0b' : '#a855f7',
            borderStyle: 'dashed',
            imageRendering: 'pixelated',
            boxShadow: zone.type === 'public' 
              ? 'inset 0 0 20px rgba(245, 158, 11, 0.3)' 
              : 'inset 0 0 20px rgba(168, 85, 247, 0.3)'
          }}
        >
          <div className="absolute -top-10 left-3 flex items-center gap-2">
            <div className="bg-amber-900 border-2 border-amber-600 rounded px-2 py-1 pixel-font">
              <span className="text-yellow-100 text-sm font-bold">{zone.name}</span>
              <div className="flex items-center gap-1 mt-1">
                <Users size={12} className="text-yellow-200" />
                <span className="text-xs text-yellow-200">{zone.playerCount}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-3 right-3 bg-amber-900 border-2 border-amber-600 rounded px-2 py-1">
            <span className="text-xs text-yellow-100 flex items-center gap-1 pixel-font">
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

      {/* Enhanced stars with pixel art style */}
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
            <div className="w-8 h-8 text-4xl animate-pulse hover:animate-bounce transition-all duration-200 group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
                 style={{ imageRendering: 'pixelated' }}>
              ⭐
            </div>
            <div className="absolute inset-0 w-8 h-8 bg-yellow-300/30 rounded-full animate-ping"
                 style={{ imageRendering: 'pixelated' }}></div>
          </div>
        </div>
      ))}

      {/* Enhanced players with pixel art characters */}
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
            className={`w-12 h-12 border-4 ${
              player.id === currentPlayer?.id 
                ? 'border-yellow-400 ring-4 ring-yellow-400/50' 
                : 'border-amber-800'
            } flex items-center justify-center text-lg font-bold text-white transition-all duration-200 hover:scale-110 pixel-font`}
            style={{ 
              backgroundColor: player.color,
              borderStyle: 'solid',
              imageRendering: 'pixelated',
              boxShadow: player.id === currentPlayer?.id 
                ? `0 0 20px ${player.color}80, 0 0 40px rgba(255, 215, 0, 0.3)` 
                : `0 0 15px ${player.color}80`
            }}
          >
            {player.name.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-amber-900 border-2 border-amber-600 px-3 py-1 rounded">
            <div className="text-xs text-yellow-100 font-medium whitespace-nowrap flex items-center gap-1 pixel-font">
              <span>{player.name}</span>
              <span className="text-yellow-400">({player.score} ⭐)</span>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced UI elements with pixel art styling */}
      <div className="absolute bottom-6 left-6 bg-amber-900 border-4 border-amber-600 rounded-xl p-4">
        <div className="text-yellow-100 text-sm space-y-2 pixel-font">
          <div className="flex items-center gap-2 font-semibold text-yellow-300 mb-2">
            <Sparkles size={16} />
            <span>Controles</span>
          </div>
          <p className="flex items-center gap-2">
            <kbd className="bg-amber-800 border-2 border-amber-600 px-2 py-1 rounded text-xs">WASD</kbd>
            <span className="text-yellow-200">ou</span>
            <kbd className="bg-amber-800 border-2 border-amber-600 px-2 py-1 rounded text-xs">↑↓←→</kbd>
            <span>para mover</span>
          </p>
          <p>
            <span className="text-yellow-300">Clique nas ⭐</span> para coletar
          </p>
        </div>
      </div>

      {/* Enhanced zone legend with pixel art styling */}
      <div className="absolute top-6 right-6 bg-amber-900 border-4 border-amber-600 rounded-xl p-4 max-w-xs">
        <div className="text-yellow-100 pixel-font">
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
