import React from 'react';
import { GameState } from '../types';
import { motion } from 'motion/react';
import { Trophy, Frown, RotateCcw } from 'lucide-react';

interface GameOverProps {
  state: GameState;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ state, onRestart }) => {
  const isWin = state === 'player_won';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md"
    >
      <div className="text-center p-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isWin ? (
            <Trophy size={120} className="mx-auto text-yellow-500 mb-6 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]" />
          ) : (
            <Frown size={120} className="mx-auto text-zinc-400 mb-6" />
          )}
          
          <h1 className="text-5xl font-black mb-2 uppercase tracking-tighter text-zinc-900">
            {isWin ? 'Victory!' : 'Defeat'}
          </h1>
          <p className="text-zinc-500 mb-8 text-lg">
            {isWin ? 'You cleared your hand first!' : 'The AI outplayed you this time.'}
          </p>
          
          <button
            onClick={onRestart}
            className="flex items-center gap-2 mx-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-full font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-900/10"
          >
            <RotateCcw size={24} />
            Play Again
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
