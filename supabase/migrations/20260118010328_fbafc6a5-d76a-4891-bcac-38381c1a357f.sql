-- Create storage bucket for game images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('game-images', 'game-images', true);

-- Create storage policies for game images
CREATE POLICY "Anyone can view game images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'game-images');

CREATE POLICY "Admins can upload game images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'game-images');

CREATE POLICY "Admins can update game images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'game-images');

CREATE POLICY "Admins can delete game images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'game-images');

-- Create games configuration table
CREATE TABLE public.games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('slots', 'table', 'crash', 'live')),
  cover_image TEXT DEFAULT '',
  background_image TEXT DEFAULT '',
  symbols JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  rtp DECIMAL(5,2) DEFAULT 96.00,
  min_bet INTEGER DEFAULT 100,
  max_bet INTEGER DEFAULT 100000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read games (public data)
CREATE POLICY "Anyone can read games"
ON public.games FOR SELECT
USING (true);

-- Allow anyone to insert games (for admin functionality - will add proper auth later)
CREATE POLICY "Anyone can insert games"
ON public.games FOR INSERT
WITH CHECK (true);

-- Allow anyone to update games (for admin functionality)
CREATE POLICY "Anyone can update games"
ON public.games FOR UPDATE
USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_games_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_games_updated_at
BEFORE UPDATE ON public.games
FOR EACH ROW
EXECUTE FUNCTION public.update_games_updated_at();

-- Insert default games
INSERT INTO public.games (id, name, category, symbols, is_active, rtp, min_bet, max_bet) VALUES
('classic-slots', 'سلوتس كلاسيكية', 'slots', '[{"id": "s1", "image": "", "name": "🍒"}, {"id": "s2", "image": "", "name": "🍋"}, {"id": "s3", "image": "", "name": "🍊"}, {"id": "s4", "image": "", "name": "7️⃣"}, {"id": "s5", "image": "", "name": "💎"}]', true, 96.5, 100, 100000),
('fruits-slots', 'فواكه استوائية', 'slots', '[{"id": "s1", "image": "", "name": "🍇"}, {"id": "s2", "image": "", "name": "🍓"}, {"id": "s3", "image": "", "name": "🍌"}, {"id": "s4", "image": "", "name": "🥝"}, {"id": "s5", "image": "", "name": "🌟"}]', true, 95.8, 50, 50000),
('blackjack', 'بلاك جاك', 'table', '[]', true, 99.5, 500, 500000),
('roulette', 'روليت أوروبية', 'table', '[]', true, 97.3, 100, 200000),
('aviator', 'أفياتور كراش', 'crash', '[]', true, 97.0, 100, 100000);