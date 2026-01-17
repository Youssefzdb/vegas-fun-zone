import React, { useState } from 'react';
import { useAdmin, SystemUser } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { 
  Users, Coins, Plus, Minus, Copy, TrendingUp,
  Gamepad2, Trophy, Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const CashierTeam: React.FC = () => {
  const { currentAdmin, getTeamMembers, transferToCashierTeam, deductFromCashierTeam } = useAdmin();
  
  const [selectedMember, setSelectedMember] = useState<SystemUser | null>(null);
  const [modalType, setModalType] = useState<'send' | 'deduct' | null>(null);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  if (!currentAdmin) return null;

  const teamMembers = getTeamMembers(currentAdmin.id);

  const openModal = (member: SystemUser, type: 'send' | 'deduct') => {
    setSelectedMember(member);
    setModalType(type);
    setAmount('');
    setReason('');
  };

  const closeModal = () => {
    setSelectedMember(null);
    setModalType(null);
  };

  const handleTransfer = () => {
    if (!selectedMember || !amount) return;
    const amountNum = parseInt(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('الرجاء إدخال مبلغ صحيح');
      return;
    }

    if (amountNum > currentAdmin.balance) {
      toast.error('رصيدك غير كافٍ');
      return;
    }

    transferToCashierTeam(selectedMember.id, amountNum, reason || 'تحويل رصيد');
    toast.success(`تم تحويل ${amountNum.toLocaleString()} إلى ${selectedMember.username}`);
    closeModal();
  };

  const handleDeduct = () => {
    if (!selectedMember || !amount) return;
    const amountNum = parseInt(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('الرجاء إدخال مبلغ صحيح');
      return;
    }

    if (!reason.trim()) {
      toast.error('السبب مطلوب عند الخصم');
      return;
    }

    deductFromCashierTeam(selectedMember.id, amountNum, reason);
    toast.success(`تم خصم ${amountNum.toLocaleString()} من ${selectedMember.username}`);
    closeModal();
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${currentAdmin.referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success('تم نسخ رابط الإحالة');
  };

  return (
    <div className="space-y-6">
      {/* Cashier Info */}
      <div className="casino-card p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-4xl">
            {currentAdmin.avatar}
          </div>
          
          <div className="flex-1 text-center md:text-right">
            <h2 className="font-display text-2xl font-bold mb-2">{currentAdmin.username}</h2>
            <p className="text-muted-foreground mb-4">كاشير</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10">
                <Coins className="w-5 h-5 text-primary" />
                <span className="font-bold text-primary">{currentAdmin.balance.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">كود الإحالة:</span>
                <code className="font-mono font-bold">{currentAdmin.referralCode}</code>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyReferralLink}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="casino-card p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <p className="text-3xl font-bold">{teamMembers.length}</p>
            <p className="text-sm text-muted-foreground">أعضاء الفريق</p>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="casino-card p-6">
        <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          فريقي
        </h3>

        {teamMembers.length > 0 ? (
          <div className="grid gap-4">
            {teamMembers.map((member) => (
              <div 
                key={member.id}
                className="p-4 rounded-xl bg-secondary/30 border border-border flex flex-col md:flex-row items-center gap-4"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-2xl">
                  {member.avatar}
                </div>

                <div className="flex-1 text-center md:text-right">
                  <h4 className="font-semibold text-lg">{member.username}</h4>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">الرصيد</p>
                    <p className="font-bold text-primary">{member.balance.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">المستوى</p>
                    <p className="font-bold">{member.level}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">الألعاب</p>
                    <p className="font-bold">{member.gamesPlayed}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => openModal(member, 'send')}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 ml-1" />
                    إرسال رصيد
                  </Button>
                  <Button
                    onClick={() => openModal(member, 'deduct')}
                    variant="destructive"
                    size="sm"
                  >
                    <Minus className="w-4 h-4 ml-1" />
                    خصم رصيد
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h4 className="text-lg font-semibold mb-2">لا يوجد أعضاء في الفريق</h4>
            <p className="text-muted-foreground">
              شارك رابط الإحالة الخاص بك لإضافة أعضاء جدد
            </p>
            <Button 
              onClick={copyReferralLink} 
              className="mt-4 bg-gradient-to-r from-primary to-gold-dark"
            >
              <Copy className="w-4 h-4 ml-2" />
              نسخ رابط الإحالة
            </Button>
          </div>
        )}
      </div>

      {/* Transfer/Deduct Modal */}
      <Dialog open={!!modalType} onOpenChange={() => closeModal()}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {modalType === 'send' ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-emerald-400" />
                  </div>
                  إرسال رصيد إلى {selectedMember?.username}
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Minus className="w-5 h-5 text-red-400" />
                  </div>
                  خصم رصيد من {selectedMember?.username}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {modalType === 'send' 
                ? `رصيدك الحالي: ${currentAdmin.balance.toLocaleString()}`
                : `رصيد العضو: ${selectedMember?.balance.toLocaleString()}`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">المبلغ</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="أدخل المبلغ"
                className="bg-secondary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                السبب {modalType === 'deduct' && <span className="text-destructive">*</span>}
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={modalType === 'deduct' ? 'السبب مطلوب للخصم' : 'السبب (اختياري)'}
                className="bg-secondary/50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              إلغاء
            </Button>
            {modalType === 'send' ? (
              <Button onClick={handleTransfer} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 ml-1" />
                إرسال
              </Button>
            ) : (
              <Button onClick={handleDeduct} variant="destructive">
                <Minus className="w-4 h-4 ml-1" />
                خصم
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CashierTeam;
