import React from 'react';
import { Suit } from '../types';
import { Heart, Diamond, Club, Spade } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SuitPickerProps {
  onSelect: (suit: Suit) => void;
}

export const SuitPicker: React.FC<SuitPickerProps> = ({ onSelect }) => {
  const suits = [
    { type: Suit.HEARTS, icon: Heart, color: 'text-red-500', label: '红桃' },
    { type: Suit.DIAMONDS, icon: Diamond, color: 'text-red-500', label: '方块' },
    { type: Suit.CLUBS, icon: Club, color: 'text-zinc-900', label: '梅花' },
    { type: Suit.SPADES, icon: Spade, color: 'text-zinc-900', label: '黑桃' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm"
    >
      <div className="bg-white border border-zinc-200 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6 text-amber-600">万能牌！请选择花色</h2>
        <div className="grid grid-cols-2 gap-4">
          {suits.map((suit) => (
            <button
              key={suit.type}
              onClick={() => onSelect(suit.type)}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 hover:border-amber-500 transition-all group shadow-sm"
            >
              <suit.icon size={48} className={`${suit.color} group-hover:scale-110 transition-transform`} />
              <span className="mt-2 text-sm font-medium text-zinc-500">{suit.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
