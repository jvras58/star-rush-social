
import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Play, Users, Settings } from 'lucide-react';

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
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Users size={18} />
            Entrar no Jogo
          </button>
        ) : (
          <form onSubmit={handleJoinGame} className="flex items-center gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Seu nome..."
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
              maxLength={20}
              autoFocus
            />
            <button
              type="submit"
              disabled={!playerName.trim()}
              className="bg-green-500 hover:bg-green-600 disabled:bg-white/20 disabled:text-white/40 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setShowJoinForm(false)}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors"
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
      <div className="flex items-center gap-2 text-white/80">
        <Users size={18} />
        <span>{players.length} jogador{players.length !== 1 ? 'es' : ''}</span>
      </div>

      {gameStatus === 'waiting' && (
        <button
          onClick={startGame}
          disabled={players.length < 1}
          className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-white/20 disabled:text-white/40 text-black px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
        >
          <Play size={18} />
          Iniciar Jogo
        </button>
      )}

      {gameStatus === 'playing' && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg font-semibold">
          🎮 Jogando
        </div>
      )}

      {gameStatus === 'ended' && (
        <button
          onClick={startGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Play size={18} />
          Novo Jogo
        </button>
      )}
    </div>
  );
};

export default GameControls;
