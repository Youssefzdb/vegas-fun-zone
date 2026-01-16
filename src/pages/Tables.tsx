import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GameCard from '@/components/games/GameCard';
import { Spade } from 'lucide-react';

const tableGames = [
  {
    id: 'blackjack',
    name: 'بلاك جاك',
    category: 'ألعاب ورق',
    image: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=400&h=300&fit=crop',
    isHot: true,
    path: '/game/blackjack',
  },
  {
    id: 'roulette',
    name: 'روليت أوروبية',
    category: 'ألعاب عجلة',
    image: 'https://images.unsplash.com/photo-1517232115160-ff93364542dd?w=400&h=300&fit=crop',
    isHot: true,
    path: '/game/roulette',
  },
  {
    id: 'baccarat',
    name: 'باكارات',
    category: 'ألعاب ورق',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=300&fit=crop',
    isNew: true,
    path: '/game/baccarat',
  },
];

const Tables: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Spade className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">ألعاب الطاولة</h1>
              <p className="text-muted-foreground">بلاك جاك، روليت، باكارات والمزيد</p>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tableGames.map((game) => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tables;
