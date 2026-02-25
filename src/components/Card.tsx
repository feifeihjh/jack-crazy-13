import React from 'react';
import { motion } from 'motion/react';
import { Suit, Rank, CardData } from '../types';
import { Heart, Diamond, Club, Spade } from 'lucide-react';

interface CardProps {
  card: CardData;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
}

const SuitIcon = ({ suit, size = 20 }: { suit: Suit; size?: number }) => {
  switch (suit) {
    case Suit.HEARTS: return <Heart size={size} className="fill-red-500 text-red-500" />;
    case Suit.DIAMONDS: return <Diamond size={size} className="fill-red-500 text-red-500" />;
    case Suit.CLUBS: return <Club size={size} className="fill-zinc-900 text-zinc-900" />;
    case Suit.SPADES: return <Spade size={size} className="fill-zinc-900 text-zinc-900" />;
  }
};

const WintersweetPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="2" fill="#EAB308" />
    <circle cx="22" cy="18" r="1.5" fill="#EAB308" />
    <circle cx="18" cy="18" r="1.5" fill="#EAB308" />
    <path d="M20 20L25 30M20 20L10 25" stroke="#854d0e" strokeWidth="0.5" />
    
    <circle cx="80" cy="70" r="2.5" fill="#EAB308" />
    <circle cx="83" cy="68" r="2" fill="#EAB308" />
    <circle cx="77" cy="68" r="2" fill="#EAB308" />
    <path d="M80 70L85 85M80 70L70 75" stroke="#854d0e" strokeWidth="0.5" />

    <circle cx="40" cy="45" r="1.5" fill="#EAB308" />
    <circle cx="42" cy="43" r="1" fill="#EAB308" />
  </svg>
);

const RankDisplay = ({ rank }: { rank: Rank }) => {
  if (rank === 1) return 'A';
  if (rank === 11) return 'J';
  if (rank === 12) return 'Q';
  if (rank === 13) return 'K';
  return rank.toString();
};

export const Card: React.FC<CardProps> = ({ card, isFaceUp = true, onClick, isPlayable = false, className = "" }) => {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative w-24 h-36 sm:w-28 sm:h-40 rounded-xl border-2 flex flex-col items-center justify-between p-2 cursor-pointer transition-all duration-200 overflow-hidden
        ${isFaceUp 
          ? 'bg-white border-zinc-200 text-zinc-900' 
          : 'bg-zinc-100 border-zinc-200 bg-[repeating-linear-gradient(45deg,#f4f4f5,#f4f4f5_10px,#e4e4e7_10px,#e4e4e7_20px)]'}
        ${isPlayable ? 'ring-4 ring-amber-400/50 border-amber-500' : 'border-zinc-200'}
        ${className}
      `}
    >
      {isFaceUp ? (
        <>
          <WintersweetPattern />
          <div className="self-start flex flex-col items-center z-10">
            <span className="text-lg font-bold leading-none"><RankDisplay rank={card.rank} /></span>
            <SuitIcon suit={card.suit} size={14} />
          </div>
          
          <div className="flex-1 flex items-center justify-center z-10">
            <SuitIcon suit={card.suit} size={40} />
          </div>
          
          <div className="self-end flex flex-col items-center rotate-180 z-10">
            <span className="text-lg font-bold leading-none"><RankDisplay rank={card.rank} /></span>
            <SuitIcon suit={card.suit} size={14} />
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-zinc-300 flex items-center justify-center">
            <span className="text-zinc-400 font-mono text-xs">J13</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
