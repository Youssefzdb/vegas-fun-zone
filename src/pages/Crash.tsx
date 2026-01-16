import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GameCard from '@/components/games/GameCard';
import { Plane } from 'lucide-react';

const crashGames = [
  {
    id: 'aviator',
    name: 'أفياتور كراش',
    category: 'ألعاب كراش',
    image: 'https://images.unsplash.com/photo-1436891620584-47fd0e565afb?w=400&h=300&fit=crop',
    isHot: true,
    isNew: true,
    path: '/game/aviator',
  },
  {
    id: 'mines',
    name: 'ألغام',
    category: 'ألعاب استراتيجية',
    image: 'https://images.unsplash.com/photo-1518544866330-4e716499f800?w=400&h=300&fit=crop',
    path: '/game/mines',
  },
];

const Crash: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">ألعاب كراش</h1>
              <p className="text-muted-foreground">اصرف قبل التحطم واربح الأضعاف</p>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {crashGames.map((game) => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Crash;
