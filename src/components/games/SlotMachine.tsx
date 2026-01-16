import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface SlotMachineProps {
  theme?: 'classic' | 'fruits' | 'diamonds' | 'egypt' | 'space';
}

const SYMBOLS: Record<string, { symbols: string[]; multipliers: number[] }> = {
  classic: {
    symbols: ['🍒', '🍋', '🍊', '💎', '7️⃣', '⭐', '🔔', '🍀'],
    multipliers: [2, 2, 3, 5, 10, 4, 3, 4],
  },
  fruits: {
    symbols: ['🍎', '🍇', '🍉', '🍓', '🍌', '🥝', '🍑', '🍍'],
    multipliers: [2, 3, 2, 4, 2, 3, 5, 6],
  },
  diamonds: {
    symbols: ['💎', '💍', '👑', '🏆', '💰', '🎰', '⭐', '🌟'],
    multipliers: [3, 4, 5, 6, 8, 10, 4, 4],
  },
  egypt: {
    symbols: ['🏺', '🐫', '🦂', '👁️', '⚱️', '🌴', '☀️', '🔺'],
    multipliers: [2, 3, 4, 5, 3, 2, 6, 8],
  },
  space: {
    symbols: ['🚀', '👽', '🛸', '🌍', '🌙', '⭐', '☄️', '🪐'],
    multipliers: [3, 5, 4, 3, 2, 4, 6, 5],
  },
};

const SlotMachine: React.FC<SlotMachineProps> = ({ theme = 'classic' }) => {
  const { user, updateBalance, incrementGamesPlayed, incrementWins } = useUser();
  const [reels, setReels] = useState<string[][]>([
    ['🍒', '🍋', '🍊'],
    ['🍒', '🍋', '🍊'],
    ['🍒', '🍋', '🍊'],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(100);
  const [win, setWin] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastWin, setLastWin] = useState<{ amount: number; line: string } | null>(null);
  
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);

  const { symbols, multipliers } = SYMBOLS[theme];

  const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

  const playSound = (type: 'spin' | 'win') => {
    if (!soundEnabled) return;
    // Sound effects would be implemented here
  };

  const checkWin = (finalReels: string[][]): number => {
    const middleRow = finalReels.map((reel) => reel[1]);
    
    // Check for three of a kind
    if (middleRow[0] === middleRow[1] && middleRow[1] === middleRow[2]) {
      const symbolIndex = symbols.indexOf(middleRow[0]);
      const multiplier = multipliers[symbolIndex] || 2;
      setLastWin({ amount: bet * multiplier, line: 'ثلاثة متطابقة!' });
      return bet * multiplier;
    }
    
    // Check for two of a kind
    if (middleRow[0] === middleRow[1] || middleRow[1] === middleRow[2]) {
      setLastWin({ amount: bet * 1.5, line: 'اثنان متطابقان!' });
      return Math.floor(bet * 1.5);
    }
    
    // Check for special symbols anywhere
    const specialSymbols = ['💎', '7️⃣', '⭐', '👑'];
    const specialCount = middleRow.filter((s) => specialSymbols.includes(s)).length;
    if (specialCount >= 2) {
      setLastWin({ amount: bet * 2, line: 'رموز خاصة!' });
      return bet * 2;
    }
    
    setLastWin(null);
    return 0;
  };

  const spin = () => {
    if (!user) {
      toast.error('الرجاء تسجيل الدخول للعب');
      return;
    }
    
    if (user.balance < bet) {
      toast.error('رصيد غير كافي! أضف المزيد من الرصيد');
      return;
    }
    
    if (spinning) return;

    setSpinning(true);
    setWin(0);
    setLastWin(null);
    updateBalance(-bet);
    incrementGamesPlayed();
    playSound('spin');

    // Animate reels
    const spinDuration = 2000;
    const spinInterval = 100;
    let elapsed = 0;

    const interval = setInterval(() => {
      setReels([
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      ]);
      elapsed += spinInterval;

      if (elapsed >= spinDuration) {
        clearInterval(interval);
        
        // Final result
        const finalReels = [
          [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
          [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
          [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        ];
        setReels(finalReels);
        
        const winAmount = checkWin(finalReels);
        if (winAmount > 0) {
          setWin(winAmount);
          updateBalance(winAmount);
          incrementWins();
          playSound('win');
          toast.success(`🎉 فوز! +${winAmount.toLocaleString()}`);
        }
        
        setSpinning(false);
      }
    }, spinInterval);
  };

  const adjustBet = (amount: number) => {
    const newBet = Math.max(10, Math.min(10000, bet + amount));
    setBet(newBet);
  };

  const betPresets = [100, 500, 1000, 5000];

  return (
    <div className="max-w-lg mx-auto">
      {/* Slot Machine Frame */}
      <div className="casino-card p-6 relative overflow-hidden">
        {/* Top decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-gold-light to-primary" />
        
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-bold gold-text">
            {theme === 'classic' ? 'سلوتس كلاسيك' : 
             theme === 'fruits' ? 'فواكه ذهبية' :
             theme === 'diamonds' ? 'ألماس سلوتس' :
             theme === 'egypt' ? 'كنوز مصر' : 'فضاء سلوتس'}
          </h2>
        </div>

        {/* Reels Container */}
        <div className="bg-secondary rounded-xl p-4 mb-6 border-4 border-primary/30">
          <div className="grid grid-cols-3 gap-2">
            {reels.map((reel, reelIndex) => (
              <div 
                key={reelIndex} 
                className="bg-background rounded-lg overflow-hidden border border-border"
              >
                {reel.map((symbol, symbolIndex) => (
                  <div
                    key={symbolIndex}
                    className={`h-20 flex items-center justify-center text-4xl ${
                      symbolIndex === 1 ? 'bg-primary/10' : ''
                    } ${spinning ? 'animate-pulse' : ''}`}
                  >
                    {symbol}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Win Line Indicator */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="h-0.5 bg-primary/50" />
          </div>
        </div>

        {/* Win Display */}
        {lastWin && (
          <div className="text-center mb-4 animate-bounce-win">
            <p className="text-sm text-muted-foreground">{lastWin.line}</p>
            <p className="text-3xl font-bold gold-text">
              +{lastWin.amount.toLocaleString()}
            </p>
          </div>
        )}

        {/* Bet Controls */}
        <div className="space-y-4">
          {/* Bet Amount */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">الرهان:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustBet(-100)}
                disabled={spinning || bet <= 10}
                className="w-8 h-8 rounded-full bg-secondary hover:bg-muted flex items-center justify-center disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-24 text-center font-bold text-lg text-primary">
                {bet.toLocaleString()}
              </span>
              <button
                onClick={() => adjustBet(100)}
                disabled={spinning || bet >= 10000}
                className="w-8 h-8 rounded-full bg-secondary hover:bg-muted flex items-center justify-center disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bet Presets */}
          <div className="flex gap-2">
            {betPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => setBet(preset)}
                disabled={spinning}
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

          {/* Spin Button */}
          <Button
            onClick={spin}
            disabled={spinning || !user}
            className="w-full py-6 text-xl font-bold bg-gradient-to-r from-primary to-gold-dark hover:opacity-90 disabled:opacity-50"
          >
            {spinning ? '🎰 جاري الدوران...' : '🎰 دوران!'}
          </Button>

          {/* Sound Toggle */}
          <div className="flex justify-center">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-muted-foreground" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="mt-4 casino-card p-4">
        <h3 className="font-bold mb-2">جدول الأرباح:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span>3 متطابقة:</span>
            <span className="text-primary font-medium">x2-x10</span>
          </div>
          <div className="flex justify-between">
            <span>2 متطابقة:</span>
            <span className="text-primary font-medium">x1.5</span>
          </div>
          <div className="flex justify-between">
            <span>رموز خاصة:</span>
            <span className="text-primary font-medium">x2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;
