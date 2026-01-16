import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Sparkles } from 'lucide-react';
import GameCard from '@/components/games/GameCard';

const featuredGames = [
  {
    id: 'classic-slots',
    name: 'سلوتس كلاسيك',
    category: 'سلوتس',
    image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=300&fit=crop',
    isHot: true,
    path: '/game/classic-slots',
  },
  {
    id: 'golden-fruits',
    name: 'الفواكه الذهبية',
    category: 'سلوتس',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=300&fit=crop',
    isNew: true,
    path: '/game/golden-fruits',
  },
  {
    id: 'blackjack',
    name: 'بلاك جاك',
    category: 'طاولات',
    image: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=400&h=300&fit=crop',
    isHot: true,
    path: '/game/blackjack',
  },
  {
    id: 'roulette',
    name: 'روليت أوروبية',
    category: 'طاولات',
    image: 'https://images.unsplash.com/photo-1517232115160-ff93364542dd?w=400&h=300&fit=crop',
    path: '/game/roulette',
  },
  {
    id: 'aviator',
    name: 'أفياتور كراش',
    category: 'كراش',
    image: 'https://images.unsplash.com/photo-1436891620584-47fd0e565afb?w=400&h=300&fit=crop',
    isHot: true,
    isNew: true,
    path: '/game/aviator',
  },
  {
    id: 'diamond-slots',
    name: 'ألماس سلوتس',
    category: 'سلوتس',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
    path: '/game/diamond-slots',
  },
];

const FeaturedGames: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-card/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                الألعاب المميزة
              </h2>
              <p className="text-muted-foreground text-sm">اختيارات اللاعبين المفضلة</p>
            </div>
          </div>
          <Link 
            to="/slots" 
            className="flex items-center gap-1 text-primary hover:underline font-medium"
          >
            عرض الكل
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {featuredGames.map((game) => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGames;
