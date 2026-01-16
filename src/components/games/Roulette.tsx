import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type BetType = 'red' | 'black' | 'odd' | 'even' | 'high' | 'low' | number;

interface Bet {
  type: BetType;
  amount: number;
}

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

const Roulette: React.FC = () => {
  const { user, updateBalance, incrementGamesPlayed, incrementWins } = useUser();
  const [bets, setBets] = useState<Bet[]>([]);
  const [chipValue, setChipValue] = useState(100);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [winAmount, setWinAmount] = useState(0);
  const [rotation, setRotation] = useState(0);

  const getTotalBets = () => bets.reduce((sum, bet) => sum + bet.amount, 0);

  const placeBet = (type: BetType) => {
    if (!user) {
      toast.error('الرجاء تسجيل الدخول للعب');
      return;
    }
    if (spinning) return;
    if (getTotalBets() + chipValue > user.balance) {
      toast.error('رصيد غير كافي!');
      return;
    }

    const existingBet = bets.find((b) => b.type === type);
    if (existingBet) {
      setBets(bets.map((b) => 
        b.type === type ? { ...b, amount: b.amount + chipValue } : b
      ));
    } else {
      setBets([...bets, { type, amount: chipValue }]);
    }
  };

  const clearBets = () => {
    if (spinning) return;
    setBets([]);
  };

  const spin = () => {
    if (bets.length === 0) {
      toast.error('الرجاء وضع رهان أولاً');
      return;
    }
    if (!user) return;

    const totalBet = getTotalBets();
    updateBalance(-totalBet);
    incrementGamesPlayed();
    
    setSpinning(true);
    setResult(null);
    setWinAmount(0);

    // Animate wheel
    const newRotation = rotation + 1440 + Math.random() * 360;
    setRotation(newRotation);

    // Determine result after animation
    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 37); // 0-36
      setResult(winningNumber);

      // Calculate winnings
      let totalWin = 0;
      for (const bet of bets) {
        let won = false;
        let multiplier = 0;

        if (typeof bet.type === 'number') {
          won = bet.type === winningNumber;
          multiplier = 35;
        } else {
          switch (bet.type) {
            case 'red':
              won = RED_NUMBERS.includes(winningNumber);
              multiplier = 1;
              break;
            case 'black':
              won = BLACK_NUMBERS.includes(winningNumber);
              multiplier = 1;
              break;
            case 'odd':
              won = winningNumber !== 0 && winningNumber % 2 === 1;
              multiplier = 1;
              break;
            case 'even':
              won = winningNumber !== 0 && winningNumber % 2 === 0;
              multiplier = 1;
              break;
            case 'high':
              won = winningNumber >= 19 && winningNumber <= 36;
              multiplier = 1;
              break;
            case 'low':
              won = winningNumber >= 1 && winningNumber <= 18;
              multiplier = 1;
              break;
          }
        }

        if (won) {
          totalWin += bet.amount + bet.amount * multiplier;
        }
      }

      if (totalWin > 0) {
        setWinAmount(totalWin);
        updateBalance(totalWin);
        incrementWins();
        toast.success(`🎉 فوز! +${totalWin.toLocaleString()}`);
      }

      setSpinning(false);
      setBets([]);
    }, 3000);
  };

  const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
    if (num === 0) return 'green';
    return RED_NUMBERS.includes(num) ? 'red' : 'black';
  };

  const chips = [25, 50, 100, 500, 1000];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="casino-card p-6">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-bold gold-text">روليت أوروبية</h2>
          <p className="text-muted-foreground text-sm mt-1">اختر رقمك المحظوظ</p>
        </div>

        {/* Wheel Display */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div 
              className="w-48 h-48 md:w-64 md:h-64 roulette-wheel transition-transform duration-[3000ms] ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center border-4 border-primary">
                <span className="text-4xl font-bold gold-text">
                  {result !== null ? result : '?'}
                </span>
              </div>
            </div>
            {/* Ball indicator */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
              <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
            </div>
          </div>
        </div>

        {/* Result Display */}
        {result !== null && (
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
              getNumberColor(result) === 'red' ? 'bg-red-600' :
              getNumberColor(result) === 'black' ? 'bg-gray-900' : 'bg-emerald-600'
            }`}>
              <span className="text-2xl font-bold text-white">{result}</span>
            </div>
            {winAmount > 0 && (
              <p className="mt-2 text-2xl font-bold gold-text animate-bounce-win">
                +{winAmount.toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Betting Table */}
        <div className="bg-emerald-900 rounded-xl p-4 mb-6 border-2 border-emerald-700">
          {/* Outside Bets */}
          <div className="grid grid-cols-6 gap-2 mb-4">
            <button
              onClick={() => placeBet('red')}
              disabled={spinning}
              className="py-4 rounded-lg bg-red-600 hover:bg-red-500 transition-colors font-bold text-white disabled:opacity-50"
            >
              أحمر
              {bets.find(b => b.type === 'red') && (
                <span className="block text-xs mt-1">
                  {bets.find(b => b.type === 'red')?.amount}
                </span>
              )}
            </button>
            <button
              onClick={() => placeBet('black')}
              disabled={spinning}
              className="py-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors font-bold text-white disabled:opacity-50"
            >
              أسود
              {bets.find(b => b.type === 'black') && (
                <span className="block text-xs mt-1">
                  {bets.find(b => b.type === 'black')?.amount}
                </span>
              )}
            </button>
            <button
              onClick={() => placeBet('odd')}
              disabled={spinning}
              className="py-4 rounded-lg bg-emerald-700 hover:bg-emerald-600 transition-colors font-bold text-white disabled:opacity-50"
            >
              فردي
              {bets.find(b => b.type === 'odd') && (
                <span className="block text-xs mt-1">
                  {bets.find(b => b.type === 'odd')?.amount}
                </span>
              )}
            </button>
            <button
              onClick={() => placeBet('even')}
              disabled={spinning}
              className="py-4 rounded-lg bg-emerald-700 hover:bg-emerald-600 transition-colors font-bold text-white disabled:opacity-50"
            >
              زوجي
              {bets.find(b => b.type === 'even') && (
                <span className="block text-xs mt-1">
                  {bets.find(b => b.type === 'even')?.amount}
                </span>
              )}
            </button>
            <button
              onClick={() => placeBet('low')}
              disabled={spinning}
              className="py-4 rounded-lg bg-emerald-700 hover:bg-emerald-600 transition-colors font-bold text-white disabled:opacity-50"
            >
              1-18
              {bets.find(b => b.type === 'low') && (
                <span className="block text-xs mt-1">
                  {bets.find(b => b.type === 'low')?.amount}
                </span>
              )}
            </button>
            <button
              onClick={() => placeBet('high')}
              disabled={spinning}
              className="py-4 rounded-lg bg-emerald-700 hover:bg-emerald-600 transition-colors font-bold text-white disabled:opacity-50"
            >
              19-36
              {bets.find(b => b.type === 'high') && (
                <span className="block text-xs mt-1">
                  {bets.find(b => b.type === 'high')?.amount}
                </span>
              )}
            </button>
          </div>

          {/* Number Grid */}
          <div className="grid grid-cols-12 gap-1">
            {/* Zero */}
            <button
              onClick={() => placeBet(0)}
              disabled={spinning}
              className="col-span-12 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors font-bold text-white text-lg disabled:opacity-50"
            >
              0
              {bets.find(b => b.type === 0) && (
                <span className="ml-2 text-xs">({bets.find(b => b.type === 0)?.amount})</span>
              )}
            </button>
            
            {/* Numbers 1-36 */}
            {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => placeBet(num)}
                disabled={spinning}
                className={`py-2 rounded text-sm font-bold text-white transition-colors disabled:opacity-50 ${
                  RED_NUMBERS.includes(num)
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-gray-900 hover:bg-gray-800'
                } ${bets.find(b => b.type === num) ? 'ring-2 ring-primary' : ''}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Chip Selection */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-muted-foreground text-sm">قيمة الرقاقة:</span>
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => setChipValue(chip)}
              className={`w-12 h-12 rounded-full font-bold text-sm transition-all ${
                chipValue === chip
                  ? 'bg-primary text-primary-foreground scale-110 shadow-lg'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {chip >= 1000 ? `${chip / 1000}K` : chip}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <Button
            onClick={clearBets}
            disabled={spinning || bets.length === 0}
            variant="outline"
            className="flex-1 py-6"
          >
            مسح الرهانات
          </Button>
          <Button
            onClick={spin}
            disabled={spinning || bets.length === 0}
            className="flex-1 py-6 text-xl font-bold bg-gradient-to-r from-primary to-gold-dark"
          >
            {spinning ? 'جاري الدوران...' : `دوران (${getTotalBets().toLocaleString()})`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Roulette;
