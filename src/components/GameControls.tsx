
import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Play, Users, Settings, Gamepad2, Sparkles } from 'lucide-react';

const GameControls = () => {
  const { gameStatus, startGame, joinGame, currentPlayer, players } = useGame();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      joinGame(playerName.trim());
      setShowJoinForm(false);
      setPlayerName('');
    }
  };

  if (!currentPlayer) {
    return (
      <div className="flex items-center gap-4">
        {!showJoinForm ? (
          <button
            onClick={() => setShowJoinForm(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 border border-green-400/30"
          >
            <Users size={20} />
            <span>Entrar na Aventura</span>
          </button>
        ) : (
          <form onSubmit={handleJoinGame} className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Nome do aventureiro..."
                className="bg-black/40 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-yellow-400/70 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200 min-w-[200px]"
                maxLength={20}
                autoFocus
              />
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400/60" size={16} />
            </div>
            <button
              type="submit"
              disabled={!playerName.trim()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:text-white/50 text-white px-5 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl border border-green-400/30 disabled:border-gray-500/30"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setShowJoinForm(false)}
              className="bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white px-4 py-3 rounded-xl transition-all duration-200 border border-white/20 hover:border-white/40"
            >
              ✕
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-white/90 bg-black/30 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
        <Users size={18} className="text-blue-400" />
        <span className="font-medium">{players.length} aventureiro{players.length !== 1 ? 's' : ''}</span>
      </div>

      {gameStatus === 'waiting' && (
        <button
          onClick={startGame}
          disabled={players.length < 1}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:text-white/50 text-black px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 border border-yellow-400/50 disabled:border-gray-500/30"
        >
          <Play size={18} />
          <span>Iniciar Aventura</span>
        </button>
      )}

      {gameStatus === 'playing' && (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 text-green-300 px-6 py-3 rounded-xl font-bold backdrop-blur-sm flex items-center gap-2">
          <Gamepad2 size={18} className="animate-pulse" />
          <span>Em Jogo</span>
        </div>
      )}

      {gameStatus === 'ended' && (
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 border border-blue-400/50"
        >
          <Play size={18} />
          <span>Nova Aventura</span>
        </button>
      )}
    </div>
  );
};

export default GameControls;
