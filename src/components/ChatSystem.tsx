
import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { Send, Globe, MapPin } from 'lucide-react';

const ChatSystem = () => {
  const { chatMessages, sendMessage, currentPlayer } = useGame();
  const [message, setMessage] = useState('');
  const [chatType, setChatType] = useState<'global' | 'zone'>('global');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && currentPlayer) {
      sendMessage(message.trim(), chatType);
      setMessage('');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white mb-3">Chat</h3>
        
        {/* Chat Type Selector */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setChatType('global')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
              chatType === 'global'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <Globe size={14} />
            Global
          </button>
          <button
            onClick={() => setChatType('zone')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
              chatType === 'zone'
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <MapPin size={14} />
            Zona
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chatMessages.length === 0 ? (
          <div className="text-center text-white/40 text-sm py-8">
            <div className="mb-2">💬</div>
            <p>Seja o primeiro a enviar uma mensagem!</p>
            <p className="text-xs mt-1">
              Compartilhe localizações, forme alianças ou apenas converse
            </p>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded-lg text-sm ${
                msg.playerId === currentPlayer?.id
                  ? 'bg-blue-500/20 border-l-2 border-blue-500'
                  : 'bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {msg.playerName}
                  </span>
                  {msg.type === 'global' ? (
                    <Globe size={12} className="text-blue-400" />
                  ) : (
                    <MapPin size={12} className="text-green-400" />
                  )}
                </div>
                <span className="text-xs text-white/40">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <p className="text-white/80">{msg.message}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {currentPlayer && (
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Mensagem ${chatType === 'global' ? 'global' : 'da zona'}...`}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              maxLength={100}
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-white/40 text-white p-2 rounded-lg transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="text-xs text-white/40 mt-1">
            {chatType === 'global' ? 'Todos podem ver' : 'Apenas jogadores da sua zona'}
          </div>
        </form>
      )}
    </div>
  );
};

export default ChatSystem;
