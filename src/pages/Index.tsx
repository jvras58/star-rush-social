
import React, { useState, useEffect } from 'react';
import GameBoard from '../components/GameBoard';
import PlayerStats from '../components/PlayerStats';
import ChatSystem from '../components/ChatSystem';
import GameControls from '../components/GameControls';
import { GameProvider } from '../contexts/GameContext';

const Index = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        <div className="relative h-screen flex">
          {/* Main Game Area */}
          <div className="flex-1 flex flex-col">
            <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  ⭐ Corrida das Estrelinhas
                </h1>
                <GameControls />
              </div>
            </header>
            
            <div className="flex-1 flex">
              <div className="flex-1 relative">
                <GameBoard />
              </div>
              
              {/* Right Sidebar */}
              <div className="w-80 bg-black/30 backdrop-blur-sm border-l border-white/10 flex flex-col">
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
