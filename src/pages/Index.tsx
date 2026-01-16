import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedGames from '@/components/home/FeaturedGames';
import CategorySection from '@/components/home/CategorySection';
import { Sparkles, Shield, Gift, Zap } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'ألعاب متنوعة',
      description: 'أكثر من 10 ألعاب مختلفة تشمل السلوتس والطاولات والكراش',
    },
    {
      icon: Gift,
      title: 'رصيد مجاني',
      description: '100,000 عملة مجانية للبدء مع إمكانية إعادة الشحن',
    },
    {
      icon: Shield,
      title: 'لعب آمن',
      description: 'ترفيه خالص بدون أي مخاطر مالية حقيقية',
    },
    {
      icon: Zap,
      title: 'سريع ومتجاوب',
      description: 'تجربة سلسة على جميع الأجهزة',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16 md:pt-20">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Features */}
        <section className="py-12 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center p-4 md:p-6">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Games */}
        <FeaturedGames />

        {/* Categories */}
        <CategorySection />

        {/* CTA Section */}
        <section className="py-20 hero-gradient relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              جاهز <span className="gold-text">للفوز</span>؟
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              سجل الآن واحصل على 100,000 عملة مجانية للعب!
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
