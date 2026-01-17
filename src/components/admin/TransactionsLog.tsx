import React, { useState, useMemo } from 'react';
import { useAdmin, Transaction } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Download, ChevronLeft, ChevronRight,
  ArrowUpRight, ArrowDownRight, RefreshCw, Shield
} from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 15;

const TransactionsLog: React.FC = () => {
  const { transactions, users, isAdmin, currentAdmin } = useAdmin();
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [cashierFilter, setCashierFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Get list of cashiers for filter
  const cashiers = useMemo(() => {
    return users.filter(u => u.role === 'cashier' || u.role === 'admin');
  }, [users]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // For cashiers, only show their own transactions
    if (!isAdmin && currentAdmin) {
      result = result.filter(t => 
        t.fromUserId === currentAdmin.id || t.toUserId === currentAdmin.id
      );
    }

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(t => 
        t.fromUsername.toLowerCase().includes(searchLower) ||
        t.toUsername.toLowerCase().includes(searchLower) ||
        t.reason.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(t => t.type === typeFilter);
    }

    // Cashier filter (admin only)
    if (isAdmin && cashierFilter !== 'all') {
      result = result.filter(t => t.fromUserId === cashierFilter);
    }

    return result;
  }, [transactions, search, typeFilter, cashierFilter, isAdmin, currentAdmin]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getTypeBadge = (type: Transaction['type']) => {
    switch (type) {
      case 'transfer':
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
            <ArrowUpRight className="w-3 h-3 ml-1" />
            تحويل
          </Badge>
        );
      case 'add':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
            <ArrowUpRight className="w-3 h-3 ml-1" />
            إضافة
          </Badge>
        );
      case 'deduct':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
            <ArrowDownRight className="w-3 h-3 ml-1" />
            خصم
          </Badge>
        );
      case 'role_change':
        return (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
            <Shield className="w-3 h-3 ml-1" />
            تغيير دور
          </Badge>
        );
    }
  };

  const exportToCSV = () => {
    const headers = ['التاريخ', 'النوع', 'من', 'إلى', 'المبلغ', 'السبب'];
    const rows = filteredTransactions.map(t => [
      new Date(t.timestamp).toLocaleString('ar-SA'),
      t.type,
      t.fromUsername,
      t.toUsername,
      t.amount?.toString() || '-',
      t.reason,
    ]);

    const csv = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('تم تصدير السجل بنجاح');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="casino-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم أو السبب..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 bg-secondary/50"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-40 bg-secondary/50">
              <SelectValue placeholder="نوع العملية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              <SelectItem value="transfer">تحويل</SelectItem>
              <SelectItem value="add">إضافة</SelectItem>
              <SelectItem value="deduct">خصم</SelectItem>
              <SelectItem value="role_change">تغيير دور</SelectItem>
            </SelectContent>
          </Select>

          {isAdmin && (
            <Select value={cashierFilter} onValueChange={setCashierFilter}>
              <SelectTrigger className="w-full md:w-48 bg-secondary/50">
                <SelectValue placeholder="جميع الكاشيرات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الكاشيرات</SelectItem>
                {cashiers.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4 ml-2" />
            تصدير CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="casino-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">من</TableHead>
                <TableHead className="text-right">إلى</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">السبب</TableHead>
                <TableHead className="text-right">التاريخ والوقت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-border">
                    <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                    <TableCell className="font-medium">{transaction.fromUsername}</TableCell>
                    <TableCell>{transaction.toUsername}</TableCell>
                    <TableCell>
                      {transaction.amount ? (
                        <span className={
                          transaction.type === 'add' || transaction.type === 'transfer'
                            ? 'text-emerald-400'
                            : 'text-red-400'
                        }>
                          {transaction.type === 'deduct' ? '-' : '+'}
                          {transaction.amount.toLocaleString()}
                        </span>
                      ) : transaction.type === 'role_change' ? (
                        <span className="text-muted-foreground text-sm">
                          {transaction.previousRole} ← {transaction.newRole}
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {transaction.reason || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(transaction.timestamp).toLocaleString('ar-SA')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <RefreshCw className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-muted-foreground">لا توجد عمليات</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              عرض {paginatedTransactions.length} من {filteredTransactions.length} عملية
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
        )}
      </div>
    </div>
  );
};

export default TransactionsLog;
