import React, { useState, useEffect, useCallback } from 'react';
import { Suit, Rank, CardData, GameState, Turn } from './types';
import { Card } from './components/Card';
import { SuitPicker } from './components/SuitPicker';
import { GameOver } from './components/GameOver';
import { StartScreen } from './components/StartScreen';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Info, RefreshCw, Heart, Diamond, Club, Spade, Home } from 'lucide-react';

const INITIAL_HAND_SIZE = 8;
const WILD_RANK = 13;

const createDeck = (): CardData[] => {
  const deck: CardData[] = [];
  const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];
  
  for (const suit of suits) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank: rank as Rank,
      });
    }
  }
  return shuffle(deck);
};

const shuffle = (deck: CardData[]): CardData[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

const getSuitName = (suit: Suit) => {
  switch (suit) {
    case Suit.HEARTS: return '红桃';
    case Suit.DIAMONDS: return '方块';
    case Suit.CLUBS: return '梅花';
    case Suit.SPADES: return '黑桃';
    default: return '';
  }
};

const SuitIndicatorIcon = ({ suit, size = 16 }: { suit: Suit; size?: number }) => {
  switch (suit) {
    case Suit.HEARTS: return <Heart size={size} className="fill-white text-white" />;
    case Suit.DIAMONDS: return <Diamond size={size} className="fill-white text-white" />;
    case Suit.CLUBS: return <Club size={size} className="fill-white text-white" />;
    case Suit.SPADES: return <Spade size={size} className="fill-white text-white" />;
    default: return null;
  }
};

export default function App() {
  const [view, setView] = useState<'start' | 'game'>('start');
  const [deck, setDeck] = useState<CardData[]>([]);
  const [playerHand, setPlayerHand] = useState<CardData[]>([]);
  const [aiHand, setAiHand] = useState<CardData[]>([]);
  const [discardPile, setDiscardPile] = useState<CardData[]>([]);
  const [currentSuit, setCurrentSuit] = useState<Suit | null>(null);
  const [turn, setTurn] = useState<Turn>('player');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [showSuitPicker, setShowSuitPicker] = useState(false);
  const [pendingWildCard, setPendingWildCard] = useState<CardData | null>(null);
  const [message, setMessage] = useState<string>("轮到你了！请匹配花色或点数。");

  const initGame = useCallback(() => {
    const newDeck = createDeck();
    const pHand = newDeck.splice(0, INITIAL_HAND_SIZE);
    const aHand = newDeck.splice(0, INITIAL_HAND_SIZE);
    
    // Ensure first discard is not a wild card for simplicity
    let firstDiscardIdx = 0;
    while (newDeck[firstDiscardIdx].rank === WILD_RANK) {
      firstDiscardIdx++;
    }
    const firstDiscard = newDeck.splice(firstDiscardIdx, 1)[0];

    setDeck(newDeck);
    setPlayerHand(pHand);
    setAiHand(aHand);
    setDiscardPile([firstDiscard]);
    setCurrentSuit(firstDiscard.suit);
    setTurn('player');
    setGameState('playing');
    setShowSuitPicker(false);
    setPendingWildCard(null);
    setMessage("游戏开始！轮到你了。");
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const topCard = discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

  const isCardPlayable = (card: CardData) => {
    if (!topCard) return false;
    if (card.rank === WILD_RANK) return true;
    return card.suit === currentSuit || card.rank === topCard.rank;
  };

  const playCard = (card: CardData, isPlayer: boolean) => {
    if (isPlayer) {
      setPlayerHand(prev => prev.filter(c => c.id !== card.id));
    } else {
      setAiHand(prev => prev.filter(c => c.id !== card.id));
    }

    setDiscardPile(prev => [...prev, card]);

    if (card.rank === WILD_RANK) {
      if (isPlayer) {
        setPendingWildCard(card);
        setShowSuitPicker(true);
      } else {
        // AI chooses a suit (most frequent in hand)
        const suitCounts: Record<Suit, number> = {
          [Suit.HEARTS]: 0,
          [Suit.DIAMONDS]: 0,
          [Suit.CLUBS]: 0,
          [Suit.SPADES]: 0,
        };
        aiHand.forEach(c => {
          if (c.id !== card.id) suitCounts[c.suit]++;
        });
        const bestSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => suitCounts[a] > suitCounts[b] ? a : b);
        setCurrentSuit(bestSuit);
        setMessage(`AI 打出了一张万能牌，并选择了 ${getSuitName(bestSuit)}！`);
        setTurn('player');
      }
    } else {
      setCurrentSuit(card.suit);
      setTurn(isPlayer ? 'ai' : 'player');
      setMessage(isPlayer ? "AI 正在思考..." : "轮到你了！");
    }
  };

  const drawCard = (isPlayer: boolean) => {
    let currentDeck = [...deck];
    
    if (currentDeck.length === 0) {
      // Reshuffle discard pile into deck (except top card)
      if (discardPile.length <= 1) {
        setMessage("没有牌可以摸了！跳过回合。");
        setTurn(isPlayer ? 'ai' : 'player');
        return;
      }
      
      const newDeck = shuffle(discardPile.slice(0, -1));
      setDiscardPile([discardPile[discardPile.length - 1]]);
      currentDeck = newDeck;
      setMessage("正在重新洗牌...");
    }

    const drawn = currentDeck.pop()!;
    setDeck(currentDeck);

    if (isPlayer) {
      setPlayerHand(prev => [...prev, drawn]);
      setMessage("你摸了一张牌。");
      if (!isCardPlayable(drawn)) {
        setTurn('ai');
      }
    } else {
      setAiHand(prev => [...prev, drawn]);
      setMessage("AI 摸了一张牌。");
      if (!isCardPlayable(drawn)) {
        setTurn('player');
      }
    }
  };

  const handleSuitSelect = (suit: Suit) => {
    setCurrentSuit(suit);
    setShowSuitPicker(false);
    setPendingWildCard(null);
    setTurn('ai');
    setMessage(`你选择了 ${getSuitName(suit)}。轮到 AI 了。`);
  };

  // AI Turn Logic
  useEffect(() => {
    if (turn === 'ai' && gameState === 'playing' && !showSuitPicker) {
      const timer = setTimeout(() => {
        const playableCards = aiHand.filter(isCardPlayable);
        if (playableCards.length > 0) {
          // AI Strategy: Play non-wild cards first
          const nonWild = playableCards.filter(c => c.rank !== WILD_RANK);
          const cardToPlay = nonWild.length > 0 ? nonWild[0] : playableCards[0];
          playCard(cardToPlay, false);
        } else {
          drawCard(false);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [turn, aiHand, gameState, showSuitPicker]);

  // Win Condition Check
  useEffect(() => {
    if (playerHand.length === 0 && gameState === 'playing') {
      setGameState('player_won');
    } else if (aiHand.length === 0 && gameState === 'playing') {
      setGameState('ai_won');
    }
  }, [playerHand, aiHand, gameState]);

  if (view === 'start') {
    return <StartScreen onStart={() => setView('game')} />;
  }

  return (
    <div className="min-h-screen playing-surface flex flex-col items-center justify-between p-4 sm:p-8 select-none">
      {/* AI Hand */}
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('start')}
            className="p-2 rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-400 transition-colors shadow-sm"
            title="返回主页"
          >
            <Home size={16} />
          </button>
          <div className="flex items-center gap-2 text-zinc-500 bg-white/50 px-4 py-1 rounded-full border border-zinc-200 shadow-sm">
            <span className="text-xs font-mono uppercase tracking-widest">AI Opponent</span>
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-sm font-bold text-zinc-700">{aiHand.length} Cards</span>
          </div>
        </div>
        <div className="flex -space-x-12 sm:-space-x-16 overflow-visible h-40 items-center">
          {aiHand.map((card, i) => (
            <Card key={card.id} card={card} isFaceUp={false} className="shadow-lg" />
          ))}
        </div>
      </div>

      {/* Center Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-8 sm:gap-16 items-center">
          {/* Draw Pile */}
          <div className="flex flex-col items-center gap-2">
            <div 
              onClick={() => turn === 'player' && drawCard(true)}
              className={`
                relative w-24 h-36 sm:w-28 sm:h-40 rounded-xl border-2 border-zinc-200 bg-white 
                flex items-center justify-center cursor-pointer transition-all shadow-sm
                ${turn === 'player' ? 'hover:scale-105 active:scale-95 border-amber-400/50' : 'opacity-50 cursor-not-allowed'}
              `}
            >
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#f4f4f5,#f4f4f5_10px,#e4e4e7_10px,#e4e4e7_20px)] rounded-xl opacity-30" />
              <Layers className="text-zinc-300 z-10" size={32} />
              <span className="absolute -bottom-6 text-xs font-mono text-zinc-400 uppercase">{deck.length} Left</span>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Draw Pile</span>
          </div>

          {/* Discard Pile */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-36 sm:w-28 sm:h-40">
              <AnimatePresence mode="popLayout">
                {topCard && (
                  <Card 
                    key={topCard.id} 
                    card={topCard} 
                    className="absolute inset-0 shadow-xl border-amber-500/20" 
                  />
                )}
              </AnimatePresence>
              {topCard && currentSuit !== topCard.suit && (
                <div className="absolute -top-4 -right-4 bg-amber-500 text-white p-2 rounded-full shadow-lg animate-bounce flex items-center justify-center">
                  <SuitIndicatorIcon suit={currentSuit!} size={20} />
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Discard</span>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-white/80 backdrop-blur border border-zinc-200 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
          <Info size={20} className="text-amber-500" />
          <p className="text-sm sm:text-base font-medium text-zinc-700">{message}</p>
        </div>
      </div>

      {/* Player Hand */}
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-500 bg-white/50 px-4 py-1 rounded-full border border-zinc-200 shadow-sm">
            <span className="text-xs font-mono uppercase tracking-widest">Your Hand</span>
            <span className="text-sm font-bold text-amber-600">{playerHand.length} Cards</span>
          </div>
          <button 
            onClick={initGame}
            className="p-2 rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-400 transition-colors shadow-sm"
            title="Restart Game"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-6xl pb-8">
          {playerHand.map((card) => (
            <Card 
              key={card.id} 
              card={card} 
              isPlayable={turn === 'player' && isCardPlayable(card)}
              onClick={() => turn === 'player' && playCard(card, true)}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSuitPicker && (
          <SuitPicker onSelect={handleSuitSelect} />
        )}
        {gameState !== 'playing' && (
          <GameOver state={gameState} onRestart={initGame} />
        )}
      </AnimatePresence>
    </div>
  );
}
