import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Video, Users, Clock } from 'lucide-react';

const LiveCasino: React.FC = () => {
  const liveGames = [
    {
      id: 'live-blackjack',
      name: 'بلاك جاك مباشر',
      dealer: 'سارة',
      players: 12,
      image: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=400&h=300&fit=crop',
    },
    {
      id: 'live-roulette',
      name: 'روليت مباشر',
      dealer: 'أحمد',
      players: 24,
      image: 'https://images.unsplash.com/photo-1517232115160-ff93364542dd?w=400&h=300&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Video className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">كازينو حي</h1>
              <p className="text-muted-foreground">تجربة الكازينو المباشر الترفيهية</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="casino-card p-6 mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-medium">تجربة ترفيهية</span>
            </div>
            <p className="text-muted-foreground">
              هذا قسم ترفيهي يحاكي تجربة الكازينو الحي. جميع الموزعين افتراضيون.
            </p>
          </div>

          {/* Live Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveGames.map((game) => (
              <div key={game.id} className="casino-card overflow-hidden group">
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  
                  {/* Live Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/90 text-white text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    مباشر
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold mb-4">{game.name}</h3>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{game.players} لاعب</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>24/7</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">
                    الموزع: {game.dealer}
                  </p>

                  <button className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-bold hover:opacity-90 transition-opacity">
                    انضم للطاولة
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-12 text-center">
            <h2 className="font-display text-2xl font-bold mb-4">المزيد قريباً...</h2>
            <p className="text-muted-foreground">
              نعمل على إضافة المزيد من ألعاب الكازينو الحي الترفيهية
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LiveCasino;
