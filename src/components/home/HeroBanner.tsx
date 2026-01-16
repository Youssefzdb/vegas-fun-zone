import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Gift, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 1,
    title: 'مرحباً بك في LuxePlay',
    subtitle: 'كازينو ترفيهي فاخر',
    description: 'استمتع بأفضل ألعاب الكازينو مع 100,000 رصيد مجاني!',
    cta: 'ابدأ اللعب الآن',
    ctaLink: '/slots',
    gradient: 'from-purple-900/50 via-background to-background',
    icon: Play,
  },
  {
    id: 2,
    title: 'ألعاب سلوتس مذهلة',
    subtitle: 'أكثر من 10 ألعاب متنوعة',
    description: 'جرب حظك مع أفضل ألعاب السلوتس المجانية',
    cta: 'العب السلوتس',
    ctaLink: '/slots',
    gradient: 'from-amber-900/50 via-background to-background',
    icon: Zap,
  },
  {
    id: 3,
    title: 'مكافآت يومية',
    subtitle: 'رصيد مجاني غير محدود',
    description: 'أضف رصيداً في أي وقت واستمر في المتعة!',
    cta: 'احصل على رصيد',
    ctaLink: '/profile',
    gradient: 'from-emerald-900/50 via-background to-background',
    icon: Gift,
  },
];

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${slide.gradient} transition-all duration-700`} />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-gold-dark mb-6 shadow-lg float-animation">
            <Icon className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Subtitle */}
          <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">
            {slide.subtitle}
          </p>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gold-text">{slide.title}</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            {slide.description}
          </p>

          {/* CTA */}
          <Link to={slide.ctaLink}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-gold-dark text-primary-foreground font-bold text-lg px-8 py-6 hover:opacity-90 transition-opacity shadow-lg casino-glow"
            >
              {slide.cta}
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:bg-card transition-colors z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:bg-card transition-colors z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-primary'
                : 'bg-muted-foreground/50 hover:bg-muted-foreground'
            }`}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="absolute bottom-0 left-0 right-0 disclaimer-banner">
        <p className="text-primary text-sm">
          ⚠️ موقع ترفيهي للعب المجاني فقط - لا يوجد مال حقيقي ⚠️
        </p>
      </div>
    </section>
  );
};

export default HeroBanner;
