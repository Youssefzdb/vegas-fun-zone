import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  value: string;
  numValue: number;
}

const suits: Card['suit'][] = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      let numValue = i + 1;
      if (value === 'A') numValue = 11;
      else if (['J', 'Q', 'K'].includes(value)) numValue = 10;
      deck.push({ suit, value, numValue });
    }
  }
  return shuffle(deck);
};

const shuffle = (array: Card[]): Card[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const calculateHand = (cards: Card[]): number => {
  let total = 0;
  let aces = 0;
  
  for (const card of cards) {
    if (card.value === 'A') {
      aces++;
      total += 11;
    } else {
      total += card.numValue;
    }
  }
  
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  
  return total;
};

const PlayingCard: React.FC<{ card: Card; hidden?: boolean }> = ({ card, hidden }) => {
  const isRed = card.suit === '♥' || card.suit === '♦';
  
  if (hidden) {
    return (
      <div className="w-16 h-24 md:w-20 md:h-28 rounded-lg bg-gradient-to-br from-blue-900 to-blue-950 border-2 border-blue-700 flex items-center justify-center shadow-lg">
        <span className="text-2xl text-blue-400">?</span>
      </div>
    );
  }
  
  return (
    <div className={`w-16 h-24 md:w-20 md:h-28 rounded-lg bg-white border-2 border-gray-300 flex flex-col items-center justify-between p-2 shadow-lg ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
      <div className="self-start text-sm font-bold">{card.value}</div>
      <div className="text-2xl">{card.suit}</div>
      <div className="self-end text-sm font-bold rotate-180">{card.value}</div>
    </div>
  );
};

const Blackjack: React.FC = () => {
  const { user, updateBalance, incrementGamesPlayed, incrementWins } = useUser();
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'finished'>('betting');
  const [result, setResult] = useState<string>('');
  const [dealerRevealed, setDealerRevealed] = useState(false);

  const startGame = () => {
    if (!user) {
      toast.error('الرجاء تسجيل الدخول للعب');
      return;
    }
    if (user.balance < bet) {
      toast.error('رصيد غير كافي!');
      return;
    }

    updateBalance(-bet);
    incrementGamesPlayed();
    
    const newDeck = createDeck();
    const playerCards = [newDeck.pop()!, newDeck.pop()!];
    const dealerCards = [newDeck.pop()!, newDeck.pop()!];
    
    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setDealerRevealed(false);
    setResult('');
    
    // Check for blackjack
    const playerValue = calculateHand(playerCards);
    if (playerValue === 21) {
      setDealerRevealed(true);
      const dealerValue = calculateHand(dealerCards);
      if (dealerValue === 21) {
        setResult('تعادل! بلاك جاك للطرفين');
        updateBalance(bet);
        setGameState('finished');
      } else {
        setResult('🎉 بلاك جاك! فزت!');
        updateBalance(bet * 2.5);
        incrementWins();
        setGameState('finished');
        toast.success('بلاك جاك! 🃏');
      }
    } else {
      setGameState('playing');
    }
  };

  const hit = () => {
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newHand = [...playerHand, newCard];
    
    setDeck(newDeck);
    setPlayerHand(newHand);
    
    const value = calculateHand(newHand);
    if (value > 21) {
      setDealerRevealed(true);
      setResult('خسرت! تجاوزت 21');
      setGameState('finished');
    } else if (value === 21) {
      stand();
    }
  };

  const stand = () => {
    setDealerRevealed(true);
    setGameState('dealerTurn');
    
    let currentDeck = [...deck];
    let currentDealerHand = [...dealerHand];
    
    // Dealer draws until 17 or higher
    const dealerPlay = () => {
      while (calculateHand(currentDealerHand) < 17) {
        const newCard = currentDeck.pop()!;
        currentDealerHand = [...currentDealerHand, newCard];
      }
      
      setDeck(currentDeck);
      setDealerHand(currentDealerHand);
      
      const playerValue = calculateHand(playerHand);
      const dealerValue = calculateHand(currentDealerHand);
      
      if (dealerValue > 21) {
        setResult('🎉 فزت! الموزع تجاوز 21');
        updateBalance(bet * 2);
        incrementWins();
        toast.success('فوز!');
      } else if (playerValue > dealerValue) {
        setResult('🎉 فزت!');
        updateBalance(bet * 2);
        incrementWins();
        toast.success('فوز!');
      } else if (playerValue < dealerValue) {
        setResult('خسرت!');
      } else {
        setResult('تعادل!');
        updateBalance(bet);
      }
      
      setGameState('finished');
    };

    setTimeout(dealerPlay, 500);
  };

  const doubleDown = () => {
    if (!user || user.balance < bet) {
      toast.error('رصيد غير كافي للمضاعفة!');
      return;
    }
    
    updateBalance(-bet);
    setBet(bet * 2);
    
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newHand = [...playerHand, newCard];
    
    setDeck(newDeck);
    setPlayerHand(newHand);
    
    const value = calculateHand(newHand);
    if (value > 21) {
      setDealerRevealed(true);
      setResult('خسرت! تجاوزت 21');
      setGameState('finished');
    } else {
      setTimeout(() => stand(), 500);
    }
  };

  const playerValue = calculateHand(playerHand);
  const dealerValue = dealerRevealed ? calculateHand(dealerHand) : calculateHand([dealerHand[0]]);

  const betPresets = [100, 250, 500, 1000];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="casino-card p-6">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-bold gold-text">بلاك جاك</h2>
          <p className="text-muted-foreground text-sm mt-1">اقترب من 21 بدون تجاوزها</p>
        </div>

        {/* Game Table */}
        <div className="bg-gradient-to-b from-emerald-900 to-emerald-950 rounded-2xl p-6 min-h-[400px] border-4 border-emerald-800">
          {/* Dealer Section */}
          <div className="text-center mb-8">
            <p className="text-emerald-300 text-sm mb-2">
              الموزع {dealerRevealed ? `(${dealerValue})` : ''}
            </p>
            <div className="flex justify-center gap-2 min-h-[112px]">
              {dealerHand.map((card, index) => (
                <PlayingCard 
                  key={index} 
                  card={card} 
                  hidden={index === 1 && !dealerRevealed}
                />
              ))}
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="text-center py-4">
              <p className={`text-2xl font-bold ${result.includes('فزت') ? 'text-yellow-400' : result.includes('تعادل') ? 'text-blue-400' : 'text-red-400'}`}>
                {result}
              </p>
            </div>
          )}

          {/* Player Section */}
          <div className="text-center">
            <div className="flex justify-center gap-2 min-h-[112px] mb-2">
              {playerHand.map((card, index) => (
                <PlayingCard key={index} card={card} />
              ))}
            </div>
            <p className="text-emerald-300 text-sm">
              يدك ({playerValue})
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 space-y-4">
          {gameState === 'betting' && (
            <>
              {/* Bet Selection */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">الرهان:</span>
                <span className="text-2xl font-bold text-primary">{bet.toLocaleString()}</span>
              </div>
              
              <div className="flex gap-2 mb-4">
                {betPresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setBet(preset)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      bet === preset
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-muted'
                    }`}
                  >
                    {preset.toLocaleString()}
                  </button>
                ))}
              </div>

              <Button
                onClick={startGame}
                className="w-full py-6 text-xl font-bold bg-gradient-to-r from-primary to-gold-dark"
              >
                ابدأ اللعب
              </Button>
            </>
          )}

          {gameState === 'playing' && (
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={hit}
                className="py-6 text-lg font-bold bg-emerald-600 hover:bg-emerald-700"
              >
                سحب
              </Button>
              <Button
                onClick={stand}
                className="py-6 text-lg font-bold bg-red-600 hover:bg-red-700"
              >
                توقف
              </Button>
              <Button
                onClick={doubleDown}
                disabled={!user || user.balance < bet || playerHand.length !== 2}
                className="py-6 text-lg font-bold bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
              >
                مضاعفة
              </Button>
            </div>
          )}

          {gameState === 'finished' && (
            <Button
              onClick={() => {
                setGameState('betting');
                setPlayerHand([]);
                setDealerHand([]);
                setResult('');
                setBet(100);
              }}
              className="w-full py-6 text-xl font-bold bg-gradient-to-r from-primary to-gold-dark"
            >
              لعب مرة أخرى
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blackjack;
