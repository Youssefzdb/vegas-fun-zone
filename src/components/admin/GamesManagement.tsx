import React, { useState, useRef } from 'react';
import { useAdmin, GameConfig } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Gamepad2, Image, Settings, Save, Trash2, Plus,
  Upload, X, Eye, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff'];

const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Scale down if larger than maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

const GamesManagement: React.FC = () => {
  const { games, updateGame } = useAdmin();
  const [selectedGame, setSelectedGame] = useState<GameConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Image states
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [bgPreview, setBgPreview] = useState<string>('');
  const [symbols, setSymbols] = useState<{ id: string; image: string; name: string }[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, boolean>>({});

  const selectGame = (game: GameConfig) => {
    setSelectedGame(game);
    setCoverPreview(game.coverImage || '');
    setBgPreview(game.backgroundImage || '');
    setSymbols([...game.symbols]);
  };

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `حجم الملف كبير جداً. الحد الأقصى هو 10 ميجابايت. حجم ملفك: ${(file.size / (1024 * 1024)).toFixed(2)} ميجابايت`;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return `نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, GIF, WebP, SVG, BMP, TIFF`;
    }
    return null;
  };

  const handleImageUpload = async (
    type: 'cover' | 'background' | 'symbol',
    event: React.ChangeEvent<HTMLInputElement>,
    symbolId?: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    const uploadKey = type === 'symbol' ? `symbol-${symbolId}` : type;
    setUploadProgress(prev => ({ ...prev, [uploadKey]: true }));

    try {
      // Compress image if it's large
      let result: string;
      if (file.size > 500 * 1024) { // If larger than 500KB, compress
        result = await compressImage(file, type === 'background' ? 1920 : 800);
        toast.success('تم ضغط الصورة لتوفير المساحة');
      } else {
        // Read directly for small images
        result = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
      }
      
      if (type === 'cover') {
        setCoverPreview(result);
      } else if (type === 'background') {
        setBgPreview(result);
      } else if (type === 'symbol' && symbolId) {
        setSymbols(prev => prev.map(s => 
          s.id === symbolId ? { ...s, image: result } : s
        ));
      }
      
      toast.success('تم رفع الصورة بنجاح!');
    } catch (err) {
      toast.error('حدث خطأ أثناء رفع الصورة');
      console.error(err);
    } finally {
      setUploadProgress(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const addSymbol = () => {
    const newSymbol = {
      id: `symbol-${Date.now()}`,
      image: '',
      name: `رمز ${symbols.length + 1}`,
    };
    setSymbols([...symbols, newSymbol]);
  };

  const removeSymbol = (symbolId: string) => {
    setSymbols(symbols.filter(s => s.id !== symbolId));
  };

  const updateSymbolName = (symbolId: string, name: string) => {
    setSymbols(prev => prev.map(s => 
      s.id === symbolId ? { ...s, name } : s
    ));
  };

  const saveGame = async () => {
    if (!selectedGame) return;

    setIsSaving(true);
    
    try {
      // Update game with all changes
      updateGame(selectedGame.id, {
        coverImage: coverPreview,
        backgroundImage: bgPreview,
        symbols: symbols,
      });

      // Update the selected game state to reflect changes
      setSelectedGame(prev => prev ? {
        ...prev,
        coverImage: coverPreview,
        backgroundImage: bgPreview,
        symbols: symbols,
      } : null);

      toast.success('تم حفظ التغييرات بنجاح! ✅', {
        description: 'تم حفظ جميع الصور والإعدادات في قاعدة البيانات',
        duration: 3000,
      });
    } catch (err) {
      toast.error('حدث خطأ أثناء الحفظ', {
        description: 'يرجى المحاولة مرة أخرى',
      });
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleGameActive = (gameId: string, isActive: boolean) => {
    updateGame(gameId, { isActive });
    toast.success(isActive ? 'تم تفعيل اللعبة' : 'تم إيقاف اللعبة');
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      slots: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      table: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      crash: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      live: 'bg-red-500/20 text-red-400 border-red-500/50',
    };
    const labels: Record<string, string> = {
      slots: 'سلوتس',
      table: 'طاولة',
      crash: 'كراش',
      live: 'حي',
    };
    return (
      <Badge variant="outline" className={colors[category]}>
        {labels[category]}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Games List */}
      <div className="lg:col-span-1">
        <div className="casino-card p-4">
          <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            قائمة الألعاب
          </h3>
          
          <div className="space-y-2">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => selectGame(game)}
                className={`w-full p-4 rounded-xl text-right transition-all flex items-center justify-between group ${
                  selectedGame?.id === game.id
                    ? 'bg-primary/20 border border-primary/50'
                    : 'bg-secondary/50 hover:bg-secondary/70 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${game.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <div>
                    <p className="font-medium">{game.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getCategoryBadge(game.category)}
                      <span className="text-xs text-muted-foreground">
                        RTP: {game.rtp}%
                      </span>
                    </div>
                  </div>
                </div>
                <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Game Editor */}
      <div className="lg:col-span-2">
        {selectedGame ? (
          <div className="casino-card">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold">{selectedGame.name}</h3>
                  <p className="text-sm text-muted-foreground">تعديل إعدادات اللعبة</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="active">مفعلة</Label>
                    <Switch
                      id="active"
                      checked={selectedGame.isActive}
                      onCheckedChange={(checked) => toggleGameActive(selectedGame.id, checked)}
                    />
                  </div>
                  <Button 
                    onClick={saveGame} 
                    disabled={isSaving}
                    className="bg-gradient-to-r from-primary to-gold-dark hover:opacity-90 transition-opacity"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 ml-2" />
                        حفظ التغييرات
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="images" className="p-6">
              <TabsList className="bg-secondary/50 mb-6">
                <TabsTrigger value="images">
                  <Image className="w-4 h-4 ml-2" />
                  الصور
                </TabsTrigger>
                <TabsTrigger value="symbols">
                  <Gamepad2 className="w-4 h-4 ml-2" />
                  الرموز
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="w-4 h-4 ml-2" />
                  الإعدادات
                </TabsTrigger>
              </TabsList>

              {/* Images Tab */}
              <TabsContent value="images" className="space-y-6">
                {/* Cover Image */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">صورة الغلاف الرئيسية</Label>
                  <div className="flex gap-4">
                    <div className="relative w-48 h-32 rounded-xl bg-secondary/50 border-2 border-dashed border-border overflow-hidden group">
                      {coverPreview ? (
                        <>
                          <img 
                            src={coverPreview} 
                            alt="Cover" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setCoverPreview('')}
                            className="absolute top-2 left-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-secondary/70 transition-colors">
                          {uploadProgress['cover'] ? (
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                              <span className="text-xs text-muted-foreground">رفع صورة</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff"
                            className="hidden"
                            onChange={(e) => handleImageUpload('cover', e)}
                          />
                        </label>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">
                        هذه الصورة ستظهر في قائمة الألعاب وصفحة اللعبة
                      </p>
                      <p className="text-xs text-muted-foreground">
                        الحجم الأقصى: 10MB | JPG, PNG, GIF, WebP, SVG, BMP, TIFF
                      </p>
                      <p className="text-xs text-emerald-400 mt-1">
                        ✓ يتم ضغط الصور الكبيرة تلقائياً
                      </p>
                    </div>
                  </div>
                </div>

                {/* Background Image */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">صورة الخلفية</Label>
                  <div className="flex gap-4">
                    <div className="relative w-48 h-32 rounded-xl bg-secondary/50 border-2 border-dashed border-border overflow-hidden group">
                      {bgPreview ? (
                        <>
                          <img 
                            src={bgPreview} 
                            alt="Background" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setBgPreview('')}
                            className="absolute top-2 left-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-secondary/70 transition-colors">
                          {uploadProgress['background'] ? (
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                              <span className="text-xs text-muted-foreground">رفع صورة</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff"
                            className="hidden"
                            onChange={(e) => handleImageUpload('background', e)}
                          />
                        </label>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">
                        خلفية اللعبة التي ستظهر أثناء اللعب
                      </p>
                      <p className="text-xs text-muted-foreground">
                        الحجم الأقصى: 10MB | JPG, PNG, GIF, WebP, SVG, BMP, TIFF
                      </p>
                      <p className="text-xs text-emerald-400 mt-1">
                        ✓ يتم ضغط الصور الكبيرة تلقائياً
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Symbols Tab */}
              <TabsContent value="symbols" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">رموز اللعبة</h4>
                    <p className="text-sm text-muted-foreground">
                      أضف وعدّل رموز اللعبة التي ستظهر على البكرات
                    </p>
                  </div>
                  <Button onClick={addSymbol} variant="outline">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة رمز
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {symbols.map((symbol) => (
                    <div 
                      key={symbol.id}
                      className="p-4 rounded-xl bg-secondary/50 border border-border group relative"
                    >
                      <button
                        onClick={() => removeSymbol(symbol.id)}
                        className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-secondary/50 border-2 border-dashed border-border overflow-hidden">
                        {symbol.image ? (
                          <img 
                            src={symbol.image} 
                            alt={symbol.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-secondary/70 transition-colors">
                            {uploadProgress[`symbol-${symbol.id}`] ? (
                              <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            ) : (
                              <>
                                <Upload className="w-4 h-4 text-muted-foreground mb-1" />
                                <span className="text-xs text-muted-foreground">رفع</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff"
                              className="hidden"
                              onChange={(e) => handleImageUpload('symbol', e, symbol.id)}
                            />
                          </label>
                        )}
                      </div>

                      <Input
                        value={symbol.name}
                        onChange={(e) => updateSymbolName(symbol.id, e.target.value)}
                        className="text-center text-sm bg-secondary/30"
                        placeholder="اسم الرمز"
                      />
                    </div>
                  ))}
                </div>

                {symbols.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Gamepad2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد رموز</p>
                    <p className="text-sm">اضغط على "إضافة رمز" لإضافة رموز جديدة</p>
                  </div>
                )}
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>نسبة العائد (RTP)</Label>
                    <Input
                      type="number"
                      value={selectedGame.rtp}
                      onChange={(e) => updateGame(selectedGame.id, { rtp: parseFloat(e.target.value) })}
                      className="bg-secondary/50"
                    />
                    <p className="text-xs text-muted-foreground">النسبة المئوية للعائد النظري</p>
                  </div>

                  <div className="space-y-2">
                    <Label>الحد الأدنى للرهان</Label>
                    <Input
                      type="number"
                      value={selectedGame.minBet}
                      onChange={(e) => updateGame(selectedGame.id, { minBet: parseInt(e.target.value) })}
                      className="bg-secondary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>الحد الأقصى للرهان</Label>
                    <Input
                      type="number"
                      value={selectedGame.maxBet}
                      onChange={(e) => updateGame(selectedGame.id, { maxBet: parseInt(e.target.value) })}
                      className="bg-secondary/50"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="casino-card p-12 text-center">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">اختر لعبة للتعديل</h3>
            <p className="text-muted-foreground">
              اختر لعبة من القائمة لتعديل إعداداتها وصورها
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesManagement;
