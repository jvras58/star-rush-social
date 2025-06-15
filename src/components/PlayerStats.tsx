
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
    <div className="p-4 border-b border-yellow-500/30">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" size={20} />
            <h3 className="text-lg font-bold text-white">Placar</h3>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-yellow-500/30">
            <div className="flex items-center gap-2 text-yellow-300 font-mono text-lg">
              <Clock size={18} />
              <span>{formatTime(gameTime)}</span>
            </div>
          </div>
        </div>
        
        {gameStatus === 'ended' && (
          <div className="text-center py-3 mb-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/50 backdrop-blur-sm">
            <div className="text-yellow-300 font-bold text-lg flex items-center justify-center gap-2">
              <Crown className="text-yellow-400" size={20} />
              🏁 JOGO FINALIZADO!
              <Crown className="text-yellow-400" size={20} />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
              player.id === currentPlayer?.id 
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 shadow-lg' 
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {index === 0 && (
                  <Crown className="text-yellow-400" size={16} />
                )}
                <div className="text-sm text-white/60 font-bold min-w-[20px]">
                  #{index + 1}
                </div>
              </div>
              <div
                className="w-6 h-6 rounded-full border-2 border-white/60 shadow-lg"
                style={{ 
                  backgroundColor: player.color,
                  boxShadow: `0 0 10px ${player.color}50`
                }}
              />
              <div className="text-white text-sm font-semibold truncate max-w-16">
                {player.name}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-black/30 rounded-lg px-2 py-1">
                <span className="text-yellow-400 font-bold text-sm">
                  {player.score}
                </span>
                <span className="text-yellow-300">⭐</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                player.isOnline ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
              }`} />
            </div>
          </div>
        ))}
      </div>

      {currentPlayer && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-blue-200 mb-2">
            <MapPin size={16} />
            <span className="text-sm font-medium">Sua localização atual:</span>
          </div>
          <div className="text-white font-bold text-lg">
            {getZoneDisplayName(currentPlayer.zone)}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
