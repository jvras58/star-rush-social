
import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Trophy, Clock, Users, MapPin, Crown } from 'lucide-react';

const PlayerStats = () => {
  const { players, currentPlayer, gameTime, gameStatus } = useGame();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getZoneDisplayName = (zone: string) => {
    if (zone === 'wilderness') return 'Terra de Ninguém';
    return zone.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="p-4 border-b-4 border-amber-600 bg-amber-900">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" size={20} />
            <h3 className="text-lg font-bold text-yellow-100 pixel-font">Placar</h3>
          </div>
          <div className="bg-amber-800 border-2 border-amber-600 rounded px-3 py-2">
            <div className="flex items-center gap-2 text-yellow-300 font-mono text-sm pixel-font">
              <Clock size={16} />
              <span>{formatTime(gameTime)}</span>
            </div>
          </div>
        </div>
        
        {gameStatus === 'ended' && (
          <div className="text-center py-3 mb-4 bg-yellow-600 border-4 border-yellow-400 rounded-xl">
            <div className="text-amber-900 font-bold text-sm flex items-center justify-center gap-2 pixel-font">
              <Crown className="text-amber-800" size={16} />
              🏁 JOGO FINALIZADO!
              <Crown className="text-amber-800" size={16} />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 border-2 transition-all duration-200 ${
              player.id === currentPlayer?.id 
                ? 'bg-yellow-600 border-yellow-400' 
                : 'bg-amber-800 hover:bg-amber-700 border-amber-600'
            }`}
            style={{
              borderStyle: 'solid',
              imageRendering: 'pixelated'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {index === 0 && (
                  <Crown className="text-yellow-400" size={14} />
                )}
                <div className="text-xs text-yellow-200 font-bold min-w-[20px] pixel-font">
                  #{index + 1}
                </div>
              </div>
              <div
                className="w-6 h-6 border-2 border-amber-600"
                style={{ 
                  backgroundColor: player.color,
                  imageRendering: 'pixelated'
                }}
              />
              <div className="text-yellow-100 text-xs font-semibold truncate max-w-16 pixel-font">
                {player.name}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-amber-700 border border-amber-600 rounded px-2 py-1">
                <span className="text-yellow-400 font-bold text-xs pixel-font">
                  {player.score}
                </span>
                <span className="text-yellow-300">⭐</span>
              </div>
              <div className={`w-2 h-2 border border-amber-600 ${
                player.isOnline ? 'bg-green-400' : 'bg-red-400'
              }`} style={{ imageRendering: 'pixelated' }} />
            </div>
          </div>
        ))}
      </div>

      {currentPlayer && (
        <div className="mt-4 p-3 bg-blue-800 border-2 border-blue-600 rounded">
          <div className="flex items-center gap-2 text-blue-200 mb-2">
            <MapPin size={14} />
            <span className="text-xs font-medium pixel-font">Sua localização:</span>
          </div>
          <div className="text-blue-100 font-bold text-sm pixel-font">
            {getZoneDisplayName(currentPlayer.zone)}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
