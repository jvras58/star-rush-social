
import React from 'react';
import { useGame } from '../contexts/GameContext';

const PlayerStats = () => {
  const { players, currentPlayer, gameTime, gameStatus } = useGame();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="p-4 border-b border-white/10">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Placar</h3>
          <div className="text-yellow-400 font-mono text-lg">
            ⏱️ {formatTime(gameTime)}
          </div>
        </div>
        
        {gameStatus === 'ended' && (
          <div className="text-center py-2 mb-4 bg-yellow-500/20 rounded-lg border border-yellow-500/50">
            <div className="text-yellow-400 font-bold">🏁 JOGO FINALIZADO!</div>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-2 rounded-lg ${
              player.id === currentPlayer?.id 
                ? 'bg-yellow-500/20 border border-yellow-500/50' 
                : 'bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="text-sm text-white/60">#{index + 1}</div>
              <div
                className="w-4 h-4 rounded-full border border-white/60"
                style={{ backgroundColor: player.color }}
              />
              <div className="text-white text-sm font-medium truncate max-w-20">
                {player.name}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-yellow-400 font-bold">
                {player.score} ⭐
              </div>
              <div className={`w-2 h-2 rounded-full ${
                player.isOnline ? 'bg-green-400' : 'bg-red-400'
              }`} />
            </div>
          </div>
        ))}
      </div>

      {currentPlayer && (
        <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/50">
          <div className="text-sm text-blue-200 mb-1">Sua zona atual:</div>
          <div className="text-white font-semibold">
            {currentPlayer.zone === 'wilderness' ? 'Terra de Ninguém' : 
             currentPlayer.zone.split('-').map(word => 
               word.charAt(0).toUpperCase() + word.slice(1)
             ).join(' ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
