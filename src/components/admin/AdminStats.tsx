import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Users, Coins, UserCog, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AdminStats: React.FC = () => {
  const { getStats, isAdmin, isCashier, currentAdmin, getTeamMembers } = useAdmin();
  const stats = getStats();

  const adminCards = [
    {
      title: 'إجمالي المستخدمين',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      title: 'إجمالي الرصيد',
      value: stats.totalBalance.toLocaleString(),
      icon: Coins,
      color: 'from-primary to-gold-dark',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'عدد الكاشيرات',
      value: stats.totalCashiers.toLocaleString(),
      icon: UserCog,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'آخر عملية',
      value: stats.lastTransaction 
        ? new Date(stats.lastTransaction.timestamp).toLocaleDateString('ar-SA')
        : 'لا توجد',
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
    },
  ];

  const cashierCards = currentAdmin ? [
    {
      title: 'رصيدي',
      value: currentAdmin.balance.toLocaleString(),
      icon: Coins,
      color: 'from-primary to-gold-dark',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'أعضاء فريقي',
      value: getTeamMembers(currentAdmin.id).length.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      title: 'رمز الإحالة',
      value: currentAdmin.referralCode,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'المستوى',
      value: `المستوى ${currentAdmin.level}`,
      icon: ArrowUpRight,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
    },
  ] : [];

  const cards = isAdmin ? adminCards : cashierCards;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index}
            className="casino-card p-6 relative overflow-hidden group hover:border-primary/50 transition-all"
          >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.bgColor} rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
              <p className="text-2xl font-bold font-display">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;
