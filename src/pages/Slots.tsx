import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GameCard from '@/components/games/GameCard';
import { Dice1 } from 'lucide-react';

const slotsGames = [
  {
    id: 'classic-slots',
    name: 'سلوتس كلاسيك',
    category: 'سلوتس كلاسيكية',
    image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=300&fit=crop',
    isHot: true,
    path: '/game/classic-slots',
  },
  {
    id: 'golden-fruits',
    name: 'الفواكه الذهبية',
    category: 'سلوتس فواكه',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=300&fit=crop',
    isNew: true,
    path: '/game/golden-fruits',
  },
  {
    id: 'diamond-slots',
    name: 'ألماس سلوتس',
    category: 'سلوتس فيديو',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
    isHot: true,
    path: '/game/diamond-slots',
  },
  {
    id: 'egypt-slots',
    name: 'كنوز مصر',
    category: 'سلوتس مغامرة',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=400&h=300&fit=crop',
    path: '/game/egypt-slots',
  },
  {
    id: 'space-slots',
    name: 'فضاء سلوتس',
    category: 'سلوتس خيال علمي',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop',
    isNew: true,
    path: '/game/space-slots',
  },
];

const Slots: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Dice1 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">ألعاب السلوتس</h1>
              <p className="text-muted-foreground">اختر لعبتك المفضلة وابدأ الدوران</p>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {slotsGames.map((game) => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Slots;
