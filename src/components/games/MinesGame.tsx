import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Bomb, Gem, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const GRID_SIZE = 5;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

interface Cell {
  revealed: boolean;
  isMine: boolean;
}

const MinesGame: React.FC = () => {
  const { user, updateBalance, incrementGamesPlayed, incrementWins } = useUser();
  const [bet, setBet] = useState(100);
  const [minesCount, setMinesCount] = useState(5);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'won' | 'lost'>('betting');
  const [revealedCount, setRevealedCount] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);

  const calculateMultiplier = (revealed: number, mines: number): number => {
    const safeSpots = TOTAL_CELLS - mines;
    let multiplier = 1;
    for (let i = 0; i < revealed; i++) {
      multiplier *= (safeSpots - i) / (TOTAL_CELLS - mines - i);
    }
    return 0.97 / multiplier; // House edge
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

    // Generate mines positions
    const minePositions = new Set<number>();
    while (minePositions.size < minesCount) {
      minePositions.add(Math.floor(Math.random() * TOTAL_CELLS));
    }

    // Create grid
    const newGrid: Cell[] = Array.from({ length: TOTAL_CELLS }, (_, i) => ({
      revealed: false,
      isMine: minePositions.has(i),
    }));

    setGrid(newGrid);
    setGameState('playing');
    setRevealedCount(0);
    setCurrentMultiplier(1);
  };

  const revealCell = (index: number) => {
    if (gameState !== 'playing' || grid[index].revealed) return;

    const newGrid = [...grid];
    newGrid[index] = { ...newGrid[index], revealed: true };
    setGrid(newGrid);

    if (newGrid[index].isMine) {
      // Hit a mine - game over
      setGameState('lost');
      // Reveal all mines
      const revealedGrid = newGrid.map((cell) => ({
        ...cell,
        revealed: cell.isMine ? true : cell.revealed,
      }));
      setGrid(revealedGrid);
      toast.error('💥 ضربت لغم!');
    } else {
      // Safe cell
      const newRevealedCount = revealedCount + 1;
      setRevealedCount(newRevealedCount);
      
      const newMultiplier = calculateMultiplier(newRevealedCount, minesCount);
      setCurrentMultiplier(newMultiplier);

      // Check if won (revealed all safe cells)
      const safeSpots = TOTAL_CELLS - minesCount;
      if (newRevealedCount >= safeSpots) {
        cashOut();
      }
    }
  };

  const cashOut = () => {
    if (gameState !== 'playing' || revealedCount === 0) return;

    const winAmount = Math.floor(bet * currentMultiplier);
    updateBalance(winAmount);
    incrementWins();
    setGameState('won');
    
    // Reveal all mines
    const revealedGrid = grid.map((cell) => ({
      ...cell,
      revealed: true,
    }));
    setGrid(revealedGrid);
    
    toast.success(`🎉 صرفت! +${winAmount.toLocaleString()}`);
  };

  const resetGame = () => {
    setGameState('betting');
    setGrid([]);
    setRevealedCount(0);
    setCurrentMultiplier(1);
  };

  const betPresets = [100, 250, 500, 1000];
  const minePresets = [3, 5, 10, 15];

  return (
    <div className="max-w-lg mx-auto">
      <div className="casino-card p-6">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-bold gold-text">ألغام</h2>
          <p className="text-muted-foreground text-sm mt-1">اكشف الجواهر وتجنب الألغام</p>
        </div>

        {/* Multiplier Display */}
        {gameState === 'playing' && (
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">المضاعف الحالي</p>
            <p className="text-3xl font-bold text-primary">
              {currentMultiplier.toFixed(2)}x
            </p>
            <p className="text-sm text-muted-foreground">
              الربح المحتمل: {Math.floor(bet * currentMultiplier).toLocaleString()}
            </p>
          </div>
        )}

        {/* Game Grid */}
        <div className="bg-secondary rounded-xl p-4 mb-6">
          <div className="grid grid-cols-5 gap-2">
            {gameState === 'betting' ? (
              // Empty grid for betting
              Array.from({ length: TOTAL_CELLS }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg bg-muted flex items-center justify-center"
                >
                  <span className="text-muted-foreground text-2xl">?</span>
                </div>
              ))
            ) : (
              // Game grid
              grid.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => revealCell(index)}
                  disabled={cell.revealed || gameState !== 'playing'}
                  className={`aspect-square rounded-lg flex items-center justify-center text-2xl transition-all duration-200 ${
                    cell.revealed
                      ? cell.isMine
                        ? 'bg-red-600'
                        : 'bg-emerald-600'
                      : 'bg-muted hover:bg-muted/80 hover:scale-105'
                  } ${!cell.revealed && gameState === 'playing' ? 'cursor-pointer' : ''}`}
                >
                  {cell.revealed ? (
                    cell.isMine ? (
                      <Bomb className="w-6 h-6 text-white" />
                    ) : (
                      <Gem className="w-6 h-6 text-white" />
                    )
                  ) : (
                    <span className="text-muted-foreground">?</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {gameState === 'betting' && (
            <>
              {/* Bet Selection */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">الرهان:</span>
                <span className="text-xl font-bold text-primary">{bet.toLocaleString()}</span>
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
                    {preset}
                  </button>
                ))}
              </div>

              {/* Mines Selection */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">عدد الألغام:</span>
                <span className="text-xl font-bold text-destructive">{minesCount}</span>
              </div>
              <div className="flex gap-2 mb-4">
                {minePresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setMinesCount(preset)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      minesCount === preset
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-secondary hover:bg-muted'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <Button
                onClick={startGame}
                disabled={!user}
                className="w-full py-6 text-xl font-bold bg-gradient-to-r from-primary to-gold-dark"
              >
                ابدأ اللعب
              </Button>
            </>
          )}

          {gameState === 'playing' && (
            <Button
              onClick={cashOut}
              disabled={revealedCount === 0}
              className="w-full py-6 text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 pulse-glow"
            >
              صرف ({Math.floor(bet * currentMultiplier).toLocaleString()})
            </Button>
          )}

          {(gameState === 'won' || gameState === 'lost') && (
            <Button
              onClick={resetGame}
              className="w-full py-6 text-xl font-bold bg-gradient-to-r from-primary to-gold-dark"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              لعب مرة أخرى
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>المزيد من الألغام = مضاعفات أعلى!</p>
        </div>
      </div>
    </div>
  );
};

export default MinesGame;
