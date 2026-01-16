import React from 'react';
import { useUser } from '@/contexts/UserContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, Trophy, Coins, Plus, GamepadIcon, 
  TrendingUp, Calendar, Star
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, addBalance } = useUser();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">الرجاء تسجيل الدخول</h2>
            <p className="text-muted-foreground">يجب تسجيل الدخول لعرض ملفك الشخصي</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const xpProgress = (user.xp % 1000) / 10;
  const winRate = user.gamesPlayed > 0 
    ? ((user.totalWins / user.gamesPlayed) * 100).toFixed(1) 
    : '0';

  const stats = [
    { 
      label: 'الألعاب الملعوبة', 
      value: user.gamesPlayed.toLocaleString(), 
      icon: GamepadIcon,
      color: 'text-blue-400' 
    },
    { 
      label: 'إجمالي الفوز', 
      value: user.totalWins.toLocaleString(), 
      icon: Trophy,
      color: 'text-yellow-400' 
    },
    { 
      label: 'نسبة الفوز', 
      value: `${winRate}%`, 
      icon: TrendingUp,
      color: 'text-emerald-400' 
    },
    { 
      label: 'تاريخ الانضمام', 
      value: new Date(user.joinDate).toLocaleDateString('ar-SA'), 
      icon: Calendar,
      color: 'text-purple-400' 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="casino-card p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-5xl shadow-lg">
                {user.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-right">
                <h1 className="font-display text-3xl font-bold mb-2">{user.username}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <Star className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">المستوى {user.level}</span>
                </div>
                
                {/* XP Progress */}
                <div className="max-w-xs mx-auto md:mx-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">التقدم للمستوى التالي</span>
                    <span className="text-primary font-medium">{xpProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={xpProgress} className="h-2" />
                </div>
              </div>

              {/* Balance Card */}
              <div className="casino-card p-6 text-center min-w-[200px]">
                <p className="text-muted-foreground text-sm mb-2">رصيدك الحالي</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Coins className="w-6 h-6 text-primary" />
                  <span className="text-3xl font-bold text-primary">
                    {user.balance.toLocaleString()}
                  </span>
                </div>
                <Button
                  onClick={() => addBalance(50000)}
                  className="w-full bg-gradient-to-r from-accent to-emerald-500 text-accent-foreground font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة 50,000
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="casino-card p-6 text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Achievements */}
          <div className="casino-card p-6">
            <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              الإنجازات
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'أول فوز', emoji: '🎉', unlocked: user.totalWins >= 1 },
                { name: '10 انتصارات', emoji: '🏆', unlocked: user.totalWins >= 10 },
                { name: '100 لعبة', emoji: '🎮', unlocked: user.gamesPlayed >= 100 },
                { name: 'المستوى 5', emoji: '⭐', unlocked: user.level >= 5 },
                { name: 'الثري', emoji: '💰', unlocked: user.balance >= 500000 },
                { name: 'المليونير', emoji: '👑', unlocked: user.balance >= 1000000 },
                { name: 'المدمن', emoji: '🔥', unlocked: user.gamesPlayed >= 500 },
                { name: 'الأسطورة', emoji: '🌟', unlocked: user.level >= 10 },
              ].map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl text-center transition-all ${
                    achievement.unlocked
                      ? 'bg-primary/20 border border-primary/50'
                      : 'bg-secondary/50 opacity-50'
                  }`}
                >
                  <span className="text-3xl">{achievement.emoji}</span>
                  <p className="text-sm font-medium mt-2">{achievement.name}</p>
                  {achievement.unlocked && (
                    <span className="text-xs text-primary">✓ مفتوح</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
