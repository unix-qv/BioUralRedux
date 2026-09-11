import React, { useState } from 'react';
import { Sparkles, Volume2 } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface EnterOverlayProps {
  onEnter: () => void;
}

export const EnterOverlay: React.FC<EnterOverlayProps> = ({ onEnter }) => {
  const [entered, setEntered] = useState(false);

  const handleClick = () => {
    setEntered(true);
    // Unmute / start audio
    audioEngine.play();
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  if (entered) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black/90 pointer-events-none transition-all duration-700 opacity-0 backdrop-blur-3xl scale-110"
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center cursor-pointer select-none transition-opacity duration-500 group"
    >
      <div className="flex flex-col items-center space-y-4 text-center px-4">
        {/* Pulsing visual ring */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:border-white/50 transition-all duration-300">
            <Volume2 className="w-6 h-6 text-white group-hover:text-glow transition-all" />
          </div>
          <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-40 pointer-events-none" />
        </div>

        {/* Text prompt */}
        <h2 className="font-display font-bold text-lg md:text-xl text-white tracking-widest uppercase group-hover:text-glow transition-all">
          [ Нажмите чтобы войти ]
        </h2>
        <p className="text-xs text-zinc-400 font-body flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          Включить звук и интерактивный 3D режим
        </p>
      </div>
    </div>
  );
};
