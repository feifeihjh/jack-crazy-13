import React from 'react';
import { motion } from 'motion/react';
import { Play, Info } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

const WintersweetPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="3" fill="#EAB308" />
    <circle cx="90" cy="20" r="4" fill="#EAB308" />
    <circle cx="30" cy="80" r="2" fill="#EAB308" />
    <circle cx="70" cy="90" r="5" fill="#EAB308" />
    <path d="M10 10L20 25M90 20L80 40M30 80L40 70M70 90L60 75" stroke="#854d0e" strokeWidth="0.5" />
  </svg>
);

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen playing-surface flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <WintersweetPattern />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-2xl"
      >
        <motion.h1 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-7xl sm:text-9xl font-black text-zinc-900 mb-4 tracking-tighter uppercase"
        >
          Jack <span className="text-amber-500">Crazy</span> 13
        </motion.h1>
        
        <p className="text-zinc-500 text-lg sm:text-xl mb-12 font-medium italic">
          一场关于花色、点数与智慧的博弈
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="group relative flex items-center gap-3 px-12 py-5 bg-zinc-900 text-white rounded-full font-bold text-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-zinc-900/20"
          >
            <Play className="fill-white group-hover:translate-x-1 transition-transform" />
            开始游戏
          </button>
          
          <div className="flex items-center gap-2 text-zinc-400 px-6 py-3 rounded-full border border-zinc-200 bg-white/50 backdrop-blur">
            <Info size={18} />
            <span className="text-sm font-medium">规则：匹配花色或点数，13是万能牌</span>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-3 gap-8 opacity-40">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl border-2 border-zinc-300 flex items-center justify-center mb-2">
              <span className="font-bold text-zinc-400">8</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold">初始手牌</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl border-2 border-zinc-300 flex items-center justify-center mb-2">
              <span className="font-bold text-amber-500">13</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold">万能王牌</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl border-2 border-zinc-300 flex items-center justify-center mb-2">
              <span className="font-bold text-zinc-400">AI</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold">智能对战</span>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 text-zinc-300 text-[10px] uppercase tracking-[0.2em] font-bold">
        Crafted for Jack Crazy 13
      </div>
    </div>
  );
};
