import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Gamepad2, FileText, BarChart3, LogOut, 
  Shield, Coins, TrendingUp, Clock, UserCog
} from 'lucide-react';
import AdminStats from '@/components/admin/AdminStats';
import UsersManagement from '@/components/admin/UsersManagement';
import GamesManagement from '@/components/admin/GamesManagement';
import TransactionsLog from '@/components/admin/TransactionsLog';
import CashierTeam from '@/components/admin/CashierTeam';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const { currentAdmin, isAdmin, isCashier, loginAsAdmin, logoutAdmin } = useAdmin();
  const [loginUsername, setLoginUsername] = useState('');

  const handleLogin = () => {
    if (loginAsAdmin(loginUsername)) {
      toast.success('تم تسجيل الدخول بنجاح!');
    } else {
      toast.error('اسم المستخدم غير صحيح أو ليس لديك صلاحيات الدخول');
    }
    setLoginUsername('');
  };

  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="casino-card p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">لوحة الإدارة</h1>
            <p className="text-muted-foreground">LuxePlay Casino</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">اسم المستخدم</label>
              <Input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم (Admin)"
                className="bg-secondary/50"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full bg-gradient-to-r from-primary to-gold-dark"
            >
              تسجيل الدخول
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            للتجربة: استخدم "Admin" للدخول كمسؤول
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold">لوحة الإدارة</h1>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? 'مسؤول النظام' : 'كاشير'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left">
              <p className="font-medium">{currentAdmin.username}</p>
              <p className="text-xs text-primary flex items-center gap-1">
                <Coins className="w-3 h-3" />
                {currentAdmin.balance.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-gold-dark/20 flex items-center justify-center text-xl">
              {currentAdmin.avatar}
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={logoutAdmin}
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats */}
        <AdminStats />

        {/* Tabs */}
        <Tabs defaultValue={isCashier ? "team" : "users"} className="mt-8">
          <TabsList className="bg-card border border-border p-1 mb-6">
            {isCashier && (
              <TabsTrigger value="team" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="w-4 h-4 ml-2" />
                فريقي
              </TabsTrigger>
            )}
            {isAdmin && (
              <>
                <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <UserCog className="w-4 h-4 ml-2" />
                  إدارة المستخدمين
                </TabsTrigger>
                <TabsTrigger value="games" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Gamepad2 className="w-4 h-4 ml-2" />
                  إدارة الألعاب
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="w-4 h-4 ml-2" />
              سجل العمليات
            </TabsTrigger>
          </TabsList>

          {isCashier && (
            <TabsContent value="team">
              <CashierTeam />
            </TabsContent>
          )}

          {isAdmin && (
            <>
              <TabsContent value="users">
                <UsersManagement />
              </TabsContent>
              <TabsContent value="games">
                <GamesManagement />
              </TabsContent>
            </>
          )}

          <TabsContent value="transactions">
            <TransactionsLog />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
