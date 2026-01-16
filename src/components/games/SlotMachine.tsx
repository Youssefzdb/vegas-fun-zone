import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Minus, Plus, Zap, Star, Gift } from 'lucide-react';
import { toast } from 'sonner';

interface SlotMachineProps {
  theme?: 'classic' | 'fruits' | 'diamonds' | 'egypt' | 'space' | 'lucky777' | 'aztec' | 'ocean' | 'dragon' | 'neon';
}

const THEMES: Record<string, { 
  symbols: string[]; 
  multipliers: number[];
  name: string;
  wildSymbol?: string;
  scatterSymbol?: string;
  bonusFeature?: string;
  bgGradient: string;
}> = {
  classic: {
    symbols: ['🍒', '🍋', '🍊', '💎', '7️⃣', '⭐', '🔔', '🍀'],
    multipliers: [2, 2, 3, 5, 10, 4, 3, 4],
    name: 'سلوتس كلاسيك',
    bgGradient: 'from-red-900/50 to-background',
  },
  fruits: {
    symbols: ['🍎', '🍇', '🍉', '🍓', '🍌', '🥝', '🍑', '🍍'],
    multipliers: [2, 3, 2, 4, 2, 3, 5, 6],
    name: 'الفواكه الذهبية',
    bgGradient: 'from-green-900/50 to-background',
  },
  diamonds: {
    symbols: ['💎', '💍', '👑', '🏆', '💰', '🎰', '⭐', '🌟'],
    multipliers: [3, 4, 5, 6, 8, 10, 4, 4],
    name: 'ألماس سلوتس',
    wildSymbol: '💎',
    bgGradient: 'from-cyan-900/50 to-background',
  },
  egypt: {
    symbols: ['🏺', '🐫', '🦂', '👁️', '⚱️', '🌴', '☀️', '🔺'],
    multipliers: [2, 3, 4, 5, 3, 2, 6, 8],
    name: 'كنوز مصر',
    scatterSymbol: '🔺',
    bonusFeature: 'دورات مجانية',
    bgGradient: 'from-amber-900/50 to-background',
  },
  space: {
    symbols: ['🚀', '👽', '🛸', '🌍', '🌙', '⭐', '☄️', '🪐'],
    multipliers: [3, 5, 4, 3, 2, 4, 6, 5],
    name: 'فضاء سلوتس',
    wildSymbol: '🛸',
    bgGradient: 'from-purple-900/50 to-background',
  },
  lucky777: {
    symbols: ['7️⃣', '🎰', '💵', '💴', '🍀', '⭐', '🔔', '💎'],
    multipliers: [15, 10, 5, 5, 4, 3, 3, 8],
    name: 'لاكي 777',
    wildSymbol: '7️⃣',
    bonusFeature: 'مضاعف x3',
    bgGradient: 'from-yellow-900/50 to-background',
  },
  aztec: {
    symbols: ['🗿', '🦅', '🐆', '🌽', '💀', '🌺', '🔶', '👑'],
    multipliers: [4, 5, 6, 2, 8, 3, 10, 12],
    name: 'ذهب الأزتك',
    scatterSymbol: '🗿',
    wildSymbol: '👑',
    bonusFeature: '10 دورات مجانية',
    bgGradient: 'from-orange-900/50 to-background',
  },
  ocean: {
    symbols: ['🐙', '🦈', '🐠', '🦀', '🐚', '⚓', '🧜‍♀️', '🔱'],
    multipliers: [4, 6, 3, 3, 2, 4, 8, 15],
    name: 'كنز المحيط',
    wildSymbol: '🧜‍♀️',
    scatterSymbol: '🔱',
    bonusFeature: 'رموز متوسعة',
    bgGradient: 'from-blue-900/50 to-background',
  },
  dragon: {
    symbols: ['🐉', '🔥', '🏯', '⚔️', '🎎', '🧧', '🀄', '💰'],
    multipliers: [10, 6, 4, 5, 3, 8, 4, 5],
    name: 'تنين النار',
    wildSymbol: '🐉',
    bonusFeature: 'مضاعفات تصاعدية',
    bgGradient: 'from-red-900/50 to-background',
  },
  neon: {
    symbols: ['💜', '💙', '💚', '💛', '🔮', '🎮', '🕹️', '💿'],
    multipliers: [3, 3, 3, 3, 6, 5, 4, 8],
    name: 'نيون نايتس',
    wildSymbol: '🔮',
    bonusFeature: 'إعادة الدوران',
    bgGradient: 'from-pink-900/50 via-purple-900/50 to-background',
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
  const [lastWin, setLastWin] = useState<{ amount: number; line: string; bonus?: string } | null>(null);
  const [freeSpins, setFreeSpins] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [showBonus, setShowBonus] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [expandedWild, setExpandedWild] = useState<number | null>(null);
  
  const themeConfig = THEMES[theme];
  const { symbols, multipliers, wildSymbol, scatterSymbol, bonusFeature } = themeConfig;

  const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

  const checkWin = (finalReels: string[][]): { winAmount: number; winType: string; bonus?: string } => {
    const middleRow = finalReels.map((reel) => reel[1]);
    const topRow = finalReels.map((reel) => reel[0]);
    const bottomRow = finalReels.map((reel) => reel[2]);
    
    let totalWin = 0;
    let winType = '';
    let bonus: string | undefined;

    // Check for wild symbols (substitutes for any symbol)
    const countWithWilds = (row: string[], symbol: string) => {
      return row.filter(s => s === symbol || s === wildSymbol).length;
    };

    // Check for scatter symbols (triggers bonus)
    if (scatterSymbol) {
      const allSymbols = [...middleRow, ...topRow, ...bottomRow];
      const scatterCount = allSymbols.filter(s => s === scatterSymbol).length;
      if (scatterCount >= 3) {
        bonus = bonusFeature;
        if (bonusFeature?.includes('دورات')) {
          setFreeSpins(prev => prev + 10);
          toast.success('🎉 ربحت 10 دورات مجانية!');
        }
        totalWin += bet * scatterCount * 2;
        winType = 'سكاتر!';
      }
    }

    // Check middle row for three of a kind (with wild support)
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      if (wildSymbol && countWithWilds(middleRow, symbol) >= 3) {
        const symbolIndex = symbols.indexOf(symbol);
        let baseMultiplier = multipliers[symbolIndex] || 2;
        
        // Dragon theme: progressive multipliers
        if (theme === 'dragon') {
          baseMultiplier *= multiplier;
          setMultiplier(prev => Math.min(prev + 0.5, 5));
        }
        
        // Lucky 777 theme: triple multiplier for 7s
        if (theme === 'lucky777' && symbol === '7️⃣') {
          baseMultiplier *= 3;
          bonus = 'مضاعف x3!';
        }

        totalWin += bet * baseMultiplier;
        winType = 'ثلاثة متطابقة!';
        break;
      }
    }

    // Standard three of a kind check
    if (totalWin === 0 && middleRow[0] === middleRow[1] && middleRow[1] === middleRow[2]) {
      const symbolIndex = symbols.indexOf(middleRow[0]);
      const baseMultiplier = multipliers[symbolIndex] || 2;
      totalWin = bet * baseMultiplier * multiplier;
      winType = 'ثلاثة متطابقة!';
    }
    
    // Check for two of a kind with wild
    if (totalWin === 0) {
      if (wildSymbol && middleRow.includes(wildSymbol)) {
        const nonWilds = middleRow.filter(s => s !== wildSymbol);
        if (nonWilds.length >= 1 && new Set(nonWilds).size === 1) {
          totalWin = Math.floor(bet * 2);
          winType = 'وايلد كومبو!';
        }
      } else if (middleRow[0] === middleRow[1] || middleRow[1] === middleRow[2]) {
        totalWin = Math.floor(bet * 1.5);
        winType = 'اثنان متطابقان!';
      }
    }

    // Ocean theme: Expanded wilds
    if (theme === 'ocean' && wildSymbol) {
      for (let i = 0; i < 3; i++) {
        if (finalReels[i].includes(wildSymbol)) {
          setExpandedWild(i);
          if (totalWin === 0) {
            totalWin = bet * 2;
            winType = 'وايلد متوسع!';
            bonus = 'رمز متوسع';
          }
          break;
        }
      }
    }

    // Neon theme: Re-spin on near win
    if (theme === 'neon' && totalWin === 0) {
      const uniqueMiddle = new Set(middleRow).size;
      if (uniqueMiddle === 2) {
        bonus = 'إعادة دوران مجانية!';
        // Could trigger re-spin here
      }
    }
    
    // Check for special symbols anywhere
    const specialSymbols = ['💎', '7️⃣', '⭐', '👑', '🐉', '🔱'];
    const specialCount = middleRow.filter((s) => specialSymbols.includes(s)).length;
    if (totalWin === 0 && specialCount >= 2) {
      totalWin = bet * 2;
      winType = 'رموز خاصة!';
    }

    // Reset multiplier on loss for dragon theme
    if (theme === 'dragon' && totalWin === 0) {
      setMultiplier(1);
    }

    return { winAmount: Math.floor(totalWin), winType, bonus };
  };

  const spin = (isFree = false) => {
    if (!user) {
      toast.error('الرجاء تسجيل الدخول للعب');
      return;
    }
    
    if (!isFree && user.balance < bet && freeSpins === 0) {
      toast.error('رصيد غير كافي! أضف المزيد من الرصيد');
      return;
    }
    
    if (spinning) return;

    setSpinning(true);
    setWin(0);
    setLastWin(null);
    setExpandedWild(null);
    setShowBonus(false);

    if (freeSpins > 0) {
      setFreeSpins(prev => prev - 1);
      toast.info(`دورة مجانية! متبقي: ${freeSpins - 1}`);
    } else {
      updateBalance(-bet);
    }
    incrementGamesPlayed();

    // Animate reels with staggered stops
    const spinDuration = 2000;
    const reelDelays = [0, 300, 600];
    const finalResults: string[][] = [[], [], []];

    // Generate final results first
    for (let i = 0; i < 3; i++) {
      finalResults[i] = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    }

    // Animate each reel
    let animationCount = 0;
    reelDelays.forEach((delay, reelIndex) => {
      setTimeout(() => {
        const interval = setInterval(() => {
          setReels(prev => {
            const newReels = [...prev];
            newReels[reelIndex] = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
            return newReels;
          });
        }, 80);

        setTimeout(() => {
          clearInterval(interval);
          setReels(prev => {
            const newReels = [...prev];
            newReels[reelIndex] = finalResults[reelIndex];
            return newReels;
          });
          
          animationCount++;
          if (animationCount === 3) {
            // All reels stopped
            const { winAmount, winType, bonus } = checkWin(finalResults);
            if (winAmount > 0) {
              setWin(winAmount);
              setLastWin({ amount: winAmount, line: winType, bonus });
              updateBalance(winAmount);
              incrementWins();
              if (bonus) {
                setShowBonus(true);
              }
              toast.success(`🎉 ${winType} +${winAmount.toLocaleString()}`);
            }
            setSpinning(false);
          }
        }, spinDuration - delay);
      }, delay);
    });
  };

  // Auto-play effect
  useEffect(() => {
    if (autoPlay && !spinning && user && user.balance >= bet) {
      const timer = setTimeout(() => spin(), 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, spinning]);

  // Free spins auto-continue
  useEffect(() => {
    if (freeSpins > 0 && !spinning) {
      const timer = setTimeout(() => spin(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [freeSpins, spinning]);

  const adjustBet = (amount: number) => {
    const newBet = Math.max(10, Math.min(10000, bet + amount));
    setBet(newBet);
  };

  const betPresets = [100, 500, 1000, 5000];

  return (
    <div className="max-w-lg mx-auto">
      {/* Slot Machine Frame */}
      <div className={`casino-card p-6 relative overflow-hidden bg-gradient-to-b ${themeConfig.bgGradient}`}>
        {/* Top decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-gold-light to-primary" />
        
        {/* Title with Theme Badge */}
        <div className="text-center mb-4">
          <h2 className="font-display text-2xl font-bold gold-text">
            {themeConfig.name}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            {wildSymbol && (
              <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs flex items-center gap-1">
                <Zap className="w-3 h-3" /> وايلد {wildSymbol}
              </span>
            )}
            {scatterSymbol && (
              <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs flex items-center gap-1">
                <Star className="w-3 h-3" /> سكاتر {scatterSymbol}
              </span>
            )}
            {bonusFeature && (
              <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-1">
                <Gift className="w-3 h-3" /> {bonusFeature}
              </span>
            )}
          </div>
        </div>

        {/* Free Spins Counter */}
        {freeSpins > 0 && (
          <div className="absolute top-12 left-4 right-4 text-center animate-pulse">
            <span className="px-4 py-2 rounded-full bg-emerald-500/90 text-white font-bold">
              🎁 دورات مجانية: {freeSpins}
            </span>
          </div>
        )}

        {/* Multiplier Display (Dragon theme) */}
        {theme === 'dragon' && multiplier > 1 && (
          <div className="absolute top-12 right-4">
            <span className="px-3 py-1 rounded-full bg-red-500/90 text-white font-bold text-sm">
              🔥 x{multiplier.toFixed(1)}
            </span>
          </div>
        )}

        {/* Reels Container */}
        <div className="bg-secondary/80 rounded-xl p-4 mb-6 border-4 border-primary/30 relative">
          <div className="grid grid-cols-3 gap-2">
            {reels.map((reel, reelIndex) => (
              <div 
                key={reelIndex} 
                className={`bg-background rounded-lg overflow-hidden border border-border relative ${
                  expandedWild === reelIndex ? 'ring-2 ring-purple-500 animate-pulse' : ''
                }`}
              >
                {reel.map((symbol, symbolIndex) => (
                  <div
                    key={symbolIndex}
                    className={`h-20 flex items-center justify-center text-4xl transition-all duration-200 ${
                      symbolIndex === 1 ? 'bg-primary/10 scale-110' : 'opacity-60'
                    } ${spinning ? 'blur-sm' : ''} ${
                      symbol === wildSymbol ? 'animate-pulse' : ''
                    }`}
                  >
                    {symbol}
                  </div>
                ))}
                {/* Expanded Wild Overlay */}
                {expandedWild === reelIndex && (
                  <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                    <span className="text-6xl animate-bounce">{wildSymbol}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Win Line Indicator */}
          <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className={`h-1 rounded-full ${lastWin ? 'bg-primary animate-pulse' : 'bg-primary/30'}`} />
          </div>
        </div>

        {/* Win Display */}
        {lastWin && (
          <div className="text-center mb-4 animate-bounce">
            <p className="text-sm text-muted-foreground">{lastWin.line}</p>
            <p className="text-3xl font-bold gold-text">
              +{lastWin.amount.toLocaleString()}
            </p>
            {lastWin.bonus && (
              <p className="text-sm text-emerald-400 mt-1 font-medium">
                ✨ {lastWin.bonus}
              </p>
            )}
          </div>
        )}

        {/* Bonus Animation */}
        {showBonus && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 animate-fade-in">
            <div className="text-center">
              <span className="text-6xl animate-bounce block mb-4">🎉</span>
              <p className="text-2xl font-bold gold-text">ميزة خاصة!</p>
              <p className="text-lg text-muted-foreground">{bonusFeature}</p>
            </div>
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
                className="w-8 h-8 rounded-full bg-secondary hover:bg-muted flex items-center justify-center disabled:opacity-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-24 text-center font-bold text-lg text-primary">
                {bet.toLocaleString()}
              </span>
              <button
                onClick={() => adjustBet(100)}
                disabled={spinning || bet >= 10000}
                className="w-8 h-8 rounded-full bg-secondary hover:bg-muted flex items-center justify-center disabled:opacity-50 transition-colors"
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
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  bet === preset
                    ? 'bg-primary text-primary-foreground scale-105'
                    : 'bg-secondary hover:bg-muted'
                }`}
              >
                {preset.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => spin()}
              disabled={spinning || !user || freeSpins > 0}
              className="flex-1 py-6 text-xl font-bold bg-gradient-to-r from-primary to-gold-dark hover:opacity-90 disabled:opacity-50"
            >
              {spinning ? '🎰 جاري الدوران...' : freeSpins > 0 ? `🎁 ${freeSpins} دورات` : '🎰 دوران!'}
            </Button>
          </div>

          {/* Auto-Play & Sound */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              disabled={spinning}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                autoPlay ? 'bg-accent text-accent-foreground' : 'bg-secondary hover:bg-muted'
              }`}
            >
              {autoPlay ? '⏹️ إيقاف' : '▶️ تشغيل تلقائي'}
            </button>
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
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          جدول الأرباح:
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {symbols.slice(0, 6).map((symbol, index) => (
            <div key={index} className="flex justify-between items-center py-1 px-2 rounded bg-secondary/50">
              <span className="flex items-center gap-2">
                <span className="text-xl">{symbol}{symbol}{symbol}</span>
              </span>
              <span className="text-primary font-medium">x{multipliers[index]}</span>
            </div>
          ))}
        </div>
        {wildSymbol && (
          <div className="mt-3 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-sm text-purple-300">
              <span className="text-xl">{wildSymbol}</span> <strong>وايلد:</strong> يحل محل أي رمز آخر
            </p>
          </div>
        )}
        {scatterSymbol && (
          <div className="mt-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-300">
              <span className="text-xl">{scatterSymbol}</span> <strong>سكاتر:</strong> 3+ يفعّل {bonusFeature}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotMachine;
