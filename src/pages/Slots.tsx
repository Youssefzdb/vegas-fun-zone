import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GameCard from '@/components/games/GameCard';
import { Dice1, Zap, Star, Gift } from 'lucide-react';

const slotsGames = [
  {
    id: 'classic-slots',
    name: 'سلوتس كلاسيك',
    category: 'سلوتس كلاسيكية',
    image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=300&fit=crop',
    isHot: true,
    path: '/game/classic-slots',
    features: [],
  },
  {
    id: 'golden-fruits',
    name: 'الفواكه الذهبية',
    category: 'سلوتس فواكه',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=300&fit=crop',
    isNew: true,
    path: '/game/golden-fruits',
    features: [],
  },
  {
    id: 'diamond-slots',
    name: 'ألماس سلوتس',
    category: 'سلوتس فيديو',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
    isHot: true,
    path: '/game/diamond-slots',
    features: ['وايلد'],
  },
  {
    id: 'egypt-slots',
    name: 'كنوز مصر',
    category: 'سلوتس مغامرة',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=400&h=300&fit=crop',
    path: '/game/egypt-slots',
    features: ['سكاتر', 'دورات مجانية'],
  },
  {
    id: 'space-slots',
    name: 'فضاء سلوتس',
    category: 'سلوتس خيال علمي',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop',
    isNew: true,
    path: '/game/space-slots',
    features: ['وايلد'],
  },
  {
    id: 'lucky777',
    name: 'لاكي 777',
    category: 'سلوتس فيغاس',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=300&fit=crop',
    isHot: true,
    isNew: true,
    path: '/game/lucky777',
    features: ['وايلد', 'مضاعف x3'],
  },
  {
    id: 'aztec',
    name: 'ذهب الأزتك',
    category: 'سلوتس مغامرة',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop',
    isHot: true,
    path: '/game/aztec',
    features: ['سكاتر', 'وايلد', '10 دورات مجانية'],
  },
  {
    id: 'ocean',
    name: 'كنز المحيط',
    category: 'سلوتس بحرية',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
    isNew: true,
    path: '/game/ocean',
    features: ['وايلد متوسع', 'سكاتر'],
  },
  {
    id: 'dragon',
    name: 'تنين النار',
    category: 'سلوتس آسيوية',
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400&h=300&fit=crop',
    isHot: true,
    path: '/game/dragon',
    features: ['وايلد', 'مضاعفات تصاعدية'],
  },
  {
    id: 'neon',
    name: 'نيون نايتس',
    category: 'سلوتس سايبربانك',
    image: 'https://images.unsplash.com/photo-1534996858221-380b92700493?w=400&h=300&fit=crop',
    isNew: true,
    path: '/game/neon',
    features: ['وايلد', 'إعادة الدوران'],
  },
];

const FeatureBadge: React.FC<{ feature: string }> = ({ feature }) => {
  const getIcon = () => {
    if (feature.includes('وايلد')) return <Zap className="w-3 h-3" />;
    if (feature.includes('سكاتر')) return <Star className="w-3 h-3" />;
    return <Gift className="w-3 h-3" />;
  };

  const getColor = () => {
    if (feature.includes('وايلد')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    if (feature.includes('سكاتر')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${getColor()}`}>
      {getIcon()}
      {feature}
    </span>
  );
};

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
              <p className="text-muted-foreground">10 ألعاب مع مميزات خاصة - اختر لعبتك المفضلة!</p>
            </div>
          </div>

          {/* Features Legend */}
          <div className="flex flex-wrap gap-3 mb-8 p-4 casino-card">
            <span className="text-sm text-muted-foreground">المميزات:</span>
            <FeatureBadge feature="وايلد" />
            <FeatureBadge feature="سكاتر" />
            <FeatureBadge feature="دورات مجانية" />
            <FeatureBadge feature="مضاعفات" />
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {slotsGames.map((game) => (
              <div key={game.id} className="group">
                <GameCard {...game} />
                {game.features && game.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 px-1">
                    {game.features.map((feature, idx) => (
                      <FeatureBadge key={idx} feature={feature} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="casino-card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold mb-2">رموز وايلد</h3>
              <p className="text-sm text-muted-foreground">
                الرمز البري يحل محل أي رمز آخر لتشكيل تركيبات رابحة
              </p>
            </div>
            <div className="casino-card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="font-bold mb-2">رموز سكاتر</h3>
              <p className="text-sm text-muted-foreground">
                3 رموز سكاتر أو أكثر تفعّل الدورات المجانية والمكافآت
              </p>
            </div>
            <div className="casino-card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Gift className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-bold mb-2">مميزات خاصة</h3>
              <p className="text-sm text-muted-foreground">
                كل لعبة لها مميزات فريدة مثل المضاعفات وإعادة الدوران
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Slots;
