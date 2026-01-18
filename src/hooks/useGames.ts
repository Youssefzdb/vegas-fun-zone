import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GameSymbol {
  id: string;
  image: string;
  name: string;
}

export interface GameConfig {
  id: string;
  name: string;
  category: 'slots' | 'table' | 'crash' | 'live';
  coverImage: string;
  backgroundImage: string;
  symbols: GameSymbol[];
  isActive: boolean;
  rtp: number;
  minBet: number;
  maxBet: number;
}

interface DbGame {
  id: string;
  name: string;
  category: string;
  cover_image: string | null;
  background_image: string | null;
  symbols: unknown;
  is_active: boolean | null;
  rtp: number | null;
  min_bet: number | null;
  max_bet: number | null;
}

const mapDbToGame = (dbGame: DbGame): GameConfig => ({
  id: dbGame.id,
  name: dbGame.name,
  category: dbGame.category as GameConfig['category'],
  coverImage: dbGame.cover_image || '',
  backgroundImage: dbGame.background_image || '',
  symbols: Array.isArray(dbGame.symbols) ? (dbGame.symbols as GameSymbol[]) : [],
  isActive: dbGame.is_active ?? true,
  rtp: Number(dbGame.rtp) || 96,
  minBet: dbGame.min_bet || 100,
  maxBet: dbGame.max_bet || 100000,
});

export const useGames = () => {
  const [games, setGames] = useState<GameConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;

      const mappedGames = (data || []).map(mapDbToGame);
      setGames(mappedGames);
      setError(null);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('فشل في تحميل الألعاب');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('game-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('game-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const updateGame = async (
    gameId: string,
    updates: Partial<{
      coverImage: string;
      backgroundImage: string;
      symbols: GameSymbol[];
      isActive: boolean;
      rtp: number;
      minBet: number;
      maxBet: number;
    }>
  ): Promise<boolean> => {
    try {
      const dbUpdates: Record<string, unknown> = {};
      
      if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
      if (updates.backgroundImage !== undefined) dbUpdates.background_image = updates.backgroundImage;
      if (updates.symbols !== undefined) dbUpdates.symbols = updates.symbols;
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
      if (updates.rtp !== undefined) dbUpdates.rtp = updates.rtp;
      if (updates.minBet !== undefined) dbUpdates.min_bet = updates.minBet;
      if (updates.maxBet !== undefined) dbUpdates.max_bet = updates.maxBet;

      const { error: updateError } = await supabase
        .from('games')
        .update(dbUpdates)
        .eq('id', gameId);

      if (updateError) throw updateError;

      // Update local state
      setGames(prev => prev.map(g => 
        g.id === gameId 
          ? { 
              ...g, 
              ...(updates.coverImage !== undefined && { coverImage: updates.coverImage }),
              ...(updates.backgroundImage !== undefined && { backgroundImage: updates.backgroundImage }),
              ...(updates.symbols !== undefined && { symbols: updates.symbols }),
              ...(updates.isActive !== undefined && { isActive: updates.isActive }),
              ...(updates.rtp !== undefined && { rtp: updates.rtp }),
              ...(updates.minBet !== undefined && { minBet: updates.minBet }),
              ...(updates.maxBet !== undefined && { maxBet: updates.maxBet }),
            } 
          : g
      ));

      return true;
    } catch (err) {
      console.error('Error updating game:', err);
      return false;
    }
  };

  return {
    games,
    loading,
    error,
    fetchGames,
    updateGame,
    uploadImage,
  };
};
