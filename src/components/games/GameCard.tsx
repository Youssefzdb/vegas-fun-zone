import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Zap } from 'lucide-react';

interface GameCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  isHot?: boolean;
  isNew?: boolean;
  path: string;
}

const GameCard: React.FC<GameCardProps> = ({
  id,
  name,
  category,
  image,
  isHot,
  isNew,
  path,
}) => {
  return (
    <Link
      to={path}
      className="group relative block casino-card overflow-hidden hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ 
            backgroundImage: `url(${image})`,
            backgroundColor: 'hsl(var(--secondary))'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-2">
          {isHot && (
            <span className="px-2 py-1 rounded-full bg-destructive/90 text-destructive-foreground text-xs font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              حار
            </span>
          )}
          {isNew && (
            <span className="px-2 py-1 rounded-full bg-accent/90 text-accent-foreground text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3" />
              جديد
            </span>
          )}
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/50 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg pulse-glow">
            <Play className="w-8 h-8 text-primary-foreground fill-current" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm">{category}</p>
      </div>
    </Link>
  );
};

export default GameCard;
