import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SlotMachine from '@/components/games/SlotMachine';
import Blackjack from '@/components/games/Blackjack';
import Roulette from '@/components/games/Roulette';
import CrashGame from '@/components/games/CrashGame';
import MinesGame from '@/components/games/MinesGame';
import { ArrowRight } from 'lucide-react';

const gameConfigs: Record<string, { component: React.ReactNode; title: string; category: string }> = {
  'classic-slots': {
    component: <SlotMachine theme="classic" />,
    title: 'سلوتس كلاسيك',
    category: 'سلوتس',
  },
  'golden-fruits': {
    component: <SlotMachine theme="fruits" />,
    title: 'الفواكه الذهبية',
    category: 'سلوتس',
  },
  'diamond-slots': {
    component: <SlotMachine theme="diamonds" />,
    title: 'ألماس سلوتس',
    category: 'سلوتس',
  },
  'egypt-slots': {
    component: <SlotMachine theme="egypt" />,
    title: 'كنوز مصر',
    category: 'سلوتس',
  },
  'space-slots': {
    component: <SlotMachine theme="space" />,
    title: 'فضاء سلوتس',
    category: 'سلوتس',
  },
  'blackjack': {
    component: <Blackjack />,
    title: 'بلاك جاك',
    category: 'طاولات',
  },
  'roulette': {
    component: <Roulette />,
    title: 'روليت أوروبية',
    category: 'طاولات',
  },
  'baccarat': {
    component: <Blackjack />, // Using Blackjack as placeholder
    title: 'باكارات',
    category: 'طاولات',
  },
  'aviator': {
    component: <CrashGame />,
    title: 'أفياتور كراش',
    category: 'كراش',
  },
  'mines': {
    component: <MinesGame />,
    title: 'ألغام',
    category: 'كراش',
  },
};

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const game = gameId ? gameConfigs[gameId] : null;

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">اللعبة غير موجودة</h1>
            <Link to="/" className="text-primary hover:underline">
              العودة للرئيسية
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">
              الرئيسية
            </Link>
            <ArrowRight className="w-4 h-4 rotate-180" />
            <Link 
              to={game.category === 'سلوتس' ? '/slots' : game.category === 'طاولات' ? '/tables' : '/crash'} 
              className="hover:text-foreground transition-colors"
            >
              {game.category}
            </Link>
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span className="text-foreground">{game.title}</span>
          </nav>

          {/* Game Title */}
          <h1 className="font-display text-3xl font-bold text-center mb-8 gold-text">
            {game.title}
          </h1>

          {/* Game Component */}
          {game.component}

          {/* Disclaimer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              ⚠️ لعب ترفيهي فقط - لا يوجد مال حقيقي ⚠️
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GamePage;
