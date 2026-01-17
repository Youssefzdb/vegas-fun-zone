import React, { useState, useMemo } from 'react';
import { useAdmin, SystemUser, UserRole } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Edit, Plus, Minus, ChevronLeft, ChevronRight,
  Crown, UserCog, User, Copy, Users
} from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

const UsersManagement: React.FC = () => {
  const { users, addBalanceToUser, deductBalanceFromUser, changeUserRole } = useAdmin();
  
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'balance' | 'joinDate' | 'level'>('joinDate');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceReason, setBalanceReason] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [roleReason, setRoleReason] = useState('');

  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(u => 
        u.username.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.referralCode.toLowerCase().includes(searchLower)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'balance':
          return b.balance - a.balance;
        case 'level':
          return b.level - a.level;
        case 'joinDate':
        default:
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      }
    });

    return result;
  }, [users, search, roleFilter, sortBy]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-gradient-to-r from-amber-500 to-amber-600"><Crown className="w-3 h-3 ml-1" /> مسؤول</Badge>;
      case 'cashier':
        return <Badge className="bg-gradient-to-r from-blue-500 to-blue-600"><UserCog className="w-3 h-3 ml-1" /> كاشير</Badge>;
      default:
        return <Badge variant="secondary"><User className="w-3 h-3 ml-1" /> مستخدم</Badge>;
    }
  };

  const openEditModal = (user: SystemUser) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setBalanceAmount('');
    setBalanceReason('');
    setRoleReason('');
    setEditModalOpen(true);
  };

  const handleAddBalance = () => {
    if (!selectedUser || !balanceAmount) return;
    const amount = parseInt(balanceAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('الرجاء إدخال مبلغ صحيح');
      return;
    }
    addBalanceToUser(selectedUser.id, amount, balanceReason || 'إضافة رصيد من المسؤول');
    toast.success(`تمت إضافة ${amount.toLocaleString()} إلى ${selectedUser.username}`);
    setBalanceAmount('');
    setBalanceReason('');
  };

  const handleDeductBalance = () => {
    if (!selectedUser || !balanceAmount) return;
    const amount = parseInt(balanceAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('الرجاء إدخال مبلغ صحيح');
      return;
    }
    deductBalanceFromUser(selectedUser.id, amount, balanceReason || 'خصم رصيد من المسؤول');
    toast.success(`تم خصم ${amount.toLocaleString()} من ${selectedUser.username}`);
    setBalanceAmount('');
    setBalanceReason('');
  };

  const handleChangeRole = () => {
    if (!selectedUser || newRole === selectedUser.role) return;
    if (!roleReason.trim()) {
      toast.error('الرجاء إدخال سبب تغيير الدور');
      return;
    }
    changeUserRole(selectedUser.id, newRole, roleReason);
    toast.success(`تم تغيير دور ${selectedUser.username} إلى ${newRole}`);
    setEditModalOpen(false);
  };

  const copyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('تم نسخ رمز الإحالة');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="casino-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم، البريد، أو رمز الإحالة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 bg-secondary/50"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-40 bg-secondary/50">
              <SelectValue placeholder="الدور" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأدوار</SelectItem>
              <SelectItem value="admin">مسؤول</SelectItem>
              <SelectItem value="cashier">كاشير</SelectItem>
              <SelectItem value="user">مستخدم</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-full md:w-40 bg-secondary/50">
              <SelectValue placeholder="ترتيب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="joinDate">تاريخ الانضمام</SelectItem>
              <SelectItem value="balance">الرصيد</SelectItem>
              <SelectItem value="level">المستوى</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="casino-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">البريد</TableHead>
                <TableHead className="text-right">الرصيد</TableHead>
                <TableHead className="text-right">XP</TableHead>
                <TableHead className="text-right">المستوى</TableHead>
                <TableHead className="text-right">الدور</TableHead>
                <TableHead className="text-right">رمز الإحالة</TableHead>
                <TableHead className="text-right">الفريق</TableHead>
                <TableHead className="text-right">تاريخ الانضمام</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} className="border-border">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{user.avatar}</span>
                      <span className="font-medium">{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-primary font-semibold">
                    {user.balance.toLocaleString()}
                  </TableCell>
                  <TableCell>{user.xp.toLocaleString()}</TableCell>
                  <TableCell>{user.level}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-secondary px-2 py-1 rounded">
                        {user.referralCode}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => copyReferralCode(user.referralCode)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {user.teamMembers.length}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.joinDate).toLocaleDateString('ar-SA')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(user)}
                      className="text-primary hover:text-primary"
                    >
                      <Edit className="w-4 h-4 ml-1" />
                      تعديل
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            عرض {paginatedUsers.length} من {filteredUsers.length} مستخدم
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <span className="text-sm">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-3xl">{selectedUser?.avatar}</span>
              تعديل {selectedUser?.username}
            </DialogTitle>
            <DialogDescription>
              تعديل بيانات المستخدم وإدارة رصيده
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 py-4">
              {/* Balance Section */}
              <div className="space-y-4 p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">الرصيد الحالي</h4>
                  <span className="text-2xl font-bold text-primary">
                    {selectedUser.balance.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    placeholder="المبلغ"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(e.target.value)}
                    className="bg-secondary/50"
                  />
                  <Input
                    placeholder="السبب (اختياري)"
                    value={balanceReason}
                    onChange={(e) => setBalanceReason(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddBalance}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="w-4 h-4 ml-1" />
                    إضافة
                  </Button>
                  <Button
                    onClick={handleDeductBalance}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Minus className="w-4 h-4 ml-1" />
                    خصم
                  </Button>
                </div>
              </div>

              {/* Role Section */}
              <div className="space-y-4 p-4 rounded-xl bg-secondary/30">
                <h4 className="font-semibold">تغيير الدور</h4>
                
                <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">مستخدم عادي</SelectItem>
                    <SelectItem value="cashier">كاشير</SelectItem>
                    <SelectItem value="admin">مسؤول</SelectItem>
                  </SelectContent>
                </Select>

                {newRole !== selectedUser.role && (
                  <>
                    <Textarea
                      placeholder="سبب تغيير الدور (مطلوب)"
                      value={roleReason}
                      onChange={(e) => setRoleReason(e.target.value)}
                      className="bg-secondary/50"
                    />
                    <Button
                      onClick={handleChangeRole}
                      className="w-full bg-gradient-to-r from-primary to-gold-dark"
                    >
                      تأكيد تغيير الدور
                    </Button>
                  </>
                )}
              </div>

              {/* Info Section */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground">XP</p>
                  <p className="font-semibold">{selectedUser.xp.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground">المستوى</p>
                  <p className="font-semibold">{selectedUser.level}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground">الألعاب</p>
                  <p className="font-semibold">{selectedUser.gamesPlayed}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground">الانتصارات</p>
                  <p className="font-semibold">{selectedUser.totalWins}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
