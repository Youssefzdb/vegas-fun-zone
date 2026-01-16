import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Plane } from 'lucide-react';
import { toast } from 'sonner';

const CrashGame: React.FC = () => {
  const { user, updateBalance, incrementGamesPlayed, incrementWins } = useUser();
  const [bet, setBet] = useState(100);
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [cashOutMultiplier, setCashOutMultiplier] = useState(0);
  const [history, setHistory] = useState<number[]>([2.45, 1.32, 5.67, 1.08, 3.21, 1.89, 12.34, 1.56, 2.78, 1.15]);
  
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const crashPointRef = useRef<number>();

  const generateCrashPoint = () => {
    // House edge algorithm - typically crashes between 1.0 and 100x
    const random = Math.random();
    if (random < 0.05) return 1.0 + Math.random() * 0.2; // 5% instant crash
    if (random < 0.5) return 1.0 + Math.random() * 1.5; // 45% low crash
    if (random < 0.85) return 2.0 + Math.random() * 3; // 35% medium crash
    if (random < 0.98) return 5.0 + Math.random() * 10; // 13% high crash
    return 15 + Math.random() * 85; // 2% moon
  };

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
    setHasBet(true);
    setCashedOut(false);
    setCashOutMultiplier(0);
    setMultiplier(1.0);
    setGameState('flying');

    crashPointRef.current = generateCrashPoint();
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current!) / 1000;
      const newMultiplier = Math.pow(Math.E, elapsed * 0.15);
      
      if (newMultiplier >= crashPointRef.current!) {
        setMultiplier(crashPointRef.current!);
        setGameState('crashed');
        setHistory(prev => [crashPointRef.current!, ...prev.slice(0, 9)]);
        
        if (!cashedOut && hasBet) {
          toast.error(`💥 تحطم عند ${crashPointRef.current!.toFixed(2)}x`);
        }
        return;
      }

      setMultiplier(newMultiplier);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const cashOut = () => {
    if (gameState !== 'flying' || cashedOut || !hasBet) return;

    setCashedOut(true);
    setCashOutMultiplier(multiplier);
    const winAmount = Math.floor(bet * multiplier);
    updateBalance(winAmount);
    incrementWins();
    toast.success(`🎉 صرفت عند ${multiplier.toFixed(2)}x! +${winAmount.toLocaleString()}`);
  };

  const resetGame = () => {
    setGameState('waiting');
    setHasBet(false);
    setMultiplier(1.0);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const betPresets = [100, 250, 500, 1000, 2500];

  const getMultiplierColor = () => {
    if (gameState === 'crashed') return 'text-red-500';
    if (multiplier < 2) return 'text-foreground';
    if (multiplier < 5) return 'text-yellow-400';
    if (multiplier < 10) return 'text-emerald-400';
    return 'text-purple-400';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="casino-card p-6">
        <div className="text-center mb-4">
          <h2 className="font-display text-2xl font-bold gold-text">أفياتور كراش</h2>
          <p className="text-muted-foreground text-sm mt-1">اصرف قبل التحطم!</p>
        </div>

        {/* History */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {history.map((crash, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                crash < 2 ? 'bg-red-500/20 text-red-400' :
                crash < 5 ? 'bg-yellow-500/20 text-yellow-400' :
                crash < 10 ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-purple-500/20 text-purple-400'
              }`}
            >
              {crash.toFixed(2)}x
            </span>
          ))}
        </div>

        {/* Game Display */}
        <div className="crash-graph relative h-64 md:h-80 rounded-xl bg-secondary mb-6 overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-b border-border"
                style={{ top: `${i * 10}%` }}
              />
            ))}
          </div>

          {/* Multiplier Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className={`text-6xl md:text-8xl font-bold font-display transition-colors ${getMultiplierColor()}`}>
                {multiplier.toFixed(2)}x
              </p>
              {gameState === 'crashed' && (
                <p className="text-red-500 text-xl mt-2 font-bold animate-pulse">
                  💥 تحطم!
                </p>
              )}
              {cashedOut && (
                <p className="text-emerald-400 text-xl mt-2 font-bold">
                  ✓ صرفت عند {cashOutMultiplier.toFixed(2)}x
                </p>
              )}
            </div>
          </div>

          {/* Flying Plane */}
          {gameState === 'flying' && !cashedOut && (
            <div 
              className="absolute transition-all duration-100"
              style={{ 
                left: `${Math.min(80, (multiplier - 1) * 10)}%`,
                bottom: `${Math.min(80, (multiplier - 1) * 15)}%`
              }}
            >
              <div className="relative">
                <Plane className="w-12 h-12 text-primary transform -rotate-45" />
                <div className="absolute -left-8 top-1/2 w-8 h-1 bg-gradient-to-l from-primary to-transparent" />
              </div>
            </div>
          )}

          {/* Crashed Plane */}
          {gameState === 'crashed' && (
            <div className="absolute right-10 top-10">
              <Plane className="w-12 h-12 text-red-500 opacity-50 rotate-45" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {gameState === 'waiting' && (
            <>
              {/* Bet Selection */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">الرهان:</span>
                <span className="text-2xl font-bold text-primary">{bet.toLocaleString()}</span>
              </div>

              <div className="flex gap-2">
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
                    {preset >= 1000 ? `${preset / 1000}K` : preset}
                  </button>
                ))}
              </div>

              <Button
                onClick={startGame}
                disabled={!user}
                className="w-full py-6 text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
              >
                🚀 ابدأ الطيران
              </Button>
            </>
          )}

          {gameState === 'flying' && (
            <Button
              onClick={cashOut}
              disabled={cashedOut}
              className={`w-full py-8 text-2xl font-bold ${
                cashedOut 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-gold-dark hover:opacity-90 pulse-glow'
              }`}
            >
              {cashedOut ? `✓ صرفت ${cashOutMultiplier.toFixed(2)}x` : `صرف الآن (${(bet * multiplier).toFixed(0)})`}
            </Button>
          )}

          {gameState === 'crashed' && (
            <Button
              onClick={resetGame}
              className="w-full py-6 text-xl font-bold bg-gradient-to-r from-primary to-gold-dark"
            >
              لعب مرة أخرى
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>الطائرة يمكن أن تتحطم في أي لحظة!</p>
          <p>اصرف أرباحك قبل فوات الأوان 🎯</p>
        </div>
      </div>
    </div>
  );
};

export default CrashGame;
