
import React, { useState, useEffect } from 'react';
import GameBoard from '../components/GameBoard';
import PlayerStats from '../components/PlayerStats';
import ChatSystem from '../components/ChatSystem';
import GameControls from '../components/GameControls';
import { GameProvider } from '../contexts/GameContext';

const Index = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden relative">
        {/* Animated background stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="relative h-screen flex">
          {/* Main Game Area */}
          <div className="flex-1 flex flex-col">
            <header className="bg-black/40 backdrop-blur-md border-b border-yellow-500/30 p-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text">
                      Corrida das Estrelinhas
                    </h1>
                    <p className="text-sm text-yellow-200/80">Colete estrelas antes que acabem!</p>
                  </div>
                </div>
                <GameControls />
              </div>
            </header>
            
            <div className="flex-1 flex">
              <div className="flex-1 relative">
                <GameBoard />
              </div>
              
              {/* Right Sidebar */}
              <div className="w-80 bg-black/40 backdrop-blur-md border-l border-yellow-500/30 flex flex-col shadow-2xl">
                <PlayerStats />
                <ChatSystem />
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameProvider>
  );
};

export default Index;
