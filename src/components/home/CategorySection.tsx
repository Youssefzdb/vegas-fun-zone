import React from 'react';
import { Link } from 'react-router-dom';
import { Dice1, Spade, Plane, Video } from 'lucide-react';

const categories = [
  {
    id: 'slots',
    name: 'سلوتس',
    description: 'ألعاب السلوتس الكلاسيكية والحديثة',
    icon: Dice1,
    count: 5,
    path: '/slots',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'tables',
    name: 'ألعاب الطاولة',
    description: 'بلاك جاك، روليت، باكارات',
    icon: Spade,
    count: 3,
    path: '/tables',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'crash',
    name: 'ألعاب كراش',
    description: 'أفياتور وألعاب المضاعفة',
    icon: Plane,
    count: 2,
    path: '/crash',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'live',
    name: 'كازينو حي',
    description: 'تجربة الكازينو المباشر',
    icon: Video,
    count: 2,
    path: '/live',
    gradient: 'from-blue-500 to-indigo-500',
  },
];

const CategorySection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            اختر <span className="gold-text">فئتك المفضلة</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            استكشف مجموعتنا الواسعة من الألعاب الترفيهية المجانية
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={category.path}
                className="group casino-card p-6 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {category.description}
                </p>

                {/* Count Badge */}
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                  {category.count} ألعاب
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
