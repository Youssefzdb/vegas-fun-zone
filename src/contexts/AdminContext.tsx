import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'user' | 'cashier' | 'admin';

export interface SystemUser {
  id: string;
  username: string;
  email: string;
  balance: number;
  xp: number;
  level: number;
  role: UserRole;
  referralCode: string;
  referredBy: string | null;
  teamMembers: string[];
  joinDate: string;
  avatar: string;
  gamesPlayed: number;
  totalWins: number;
}

export interface Transaction {
  id: string;
  type: 'transfer' | 'deduct' | 'add' | 'role_change';
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  amount?: number;
  reason: string;
  previousRole?: UserRole;
  newRole?: UserRole;
  timestamp: string;
}

export interface GameConfig {
  id: string;
  name: string;
  category: 'slots' | 'table' | 'crash' | 'live';
  coverImage: string;
  backgroundImage: string;
  symbols: { id: string; image: string; name: string }[];
  isActive: boolean;
  rtp: number;
  minBet: number;
  maxBet: number;
}

interface AdminContextType {
  users: SystemUser[];
  transactions: Transaction[];
  games: GameConfig[];
  currentAdmin: SystemUser | null;
  isAdmin: boolean;
  isCashier: boolean;
  
  // User management
  updateUser: (userId: string, updates: Partial<SystemUser>) => void;
  addBalanceToUser: (userId: string, amount: number, reason: string) => void;
  deductBalanceFromUser: (userId: string, amount: number, reason: string) => void;
  changeUserRole: (userId: string, newRole: UserRole, reason: string) => void;
  
  // Cashier functions
  getTeamMembers: (cashierId: string) => SystemUser[];
  transferToCashierTeam: (toUserId: string, amount: number, reason: string) => void;
  deductFromCashierTeam: (fromUserId: string, amount: number, reason: string) => void;
  
  // Game management
  updateGame: (gameId: string, updates: Partial<GameConfig>) => void;
  
  // Admin login
  loginAsAdmin: (username: string) => boolean;
  logoutAdmin: () => void;
  
  // Stats
  getStats: () => {
    totalUsers: number;
    totalBalance: number;
    totalCashiers: number;
    lastTransaction: Transaction | null;
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const AVATARS = ['🎰', '🃏', '🎲', '💎', '🏆', '⭐', '🔥', '💰'];

const createDefaultUsers = (): SystemUser[] => {
  return [
    {
      id: 'admin-001',
      username: 'Admin',
      email: 'admin@luxeplay.com',
      balance: 10000000,
      xp: 50000,
      level: 50,
      role: 'admin',
      referralCode: 'ADMIN001',
      referredBy: null,
      teamMembers: [],
      joinDate: '2024-01-01T00:00:00Z',
      avatar: '👑',
      gamesPlayed: 0,
      totalWins: 0,
    },
    {
      id: 'cashier-001',
      username: 'محمد الكاشير',
      email: 'cashier1@luxeplay.com',
      balance: 500000,
      xp: 15000,
      level: 15,
      role: 'cashier',
      referralCode: 'CASH001',
      referredBy: 'admin-001',
      teamMembers: ['user-001', 'user-002'],
      joinDate: '2024-06-01T00:00:00Z',
      avatar: '💼',
      gamesPlayed: 0,
      totalWins: 0,
    },
    {
      id: 'cashier-002',
      username: 'أحمد الكاشير',
      email: 'cashier2@luxeplay.com',
      balance: 350000,
      xp: 12000,
      level: 12,
      role: 'cashier',
      referralCode: 'CASH002',
      referredBy: 'admin-001',
      teamMembers: ['user-003'],
      joinDate: '2024-07-15T00:00:00Z',
      avatar: '💳',
      gamesPlayed: 0,
      totalWins: 0,
    },
    {
      id: 'user-001',
      username: 'علي اللاعب',
      email: 'ali@example.com',
      balance: 150000,
      xp: 5000,
      level: 5,
      role: 'user',
      referralCode: generateReferralCode(),
      referredBy: 'cashier-001',
      teamMembers: [],
      joinDate: '2024-08-01T00:00:00Z',
      avatar: AVATARS[0],
      gamesPlayed: 45,
      totalWins: 18,
    },
    {
      id: 'user-002',
      username: 'سارة',
      email: 'sara@example.com',
      balance: 80000,
      xp: 3000,
      level: 3,
      role: 'user',
      referralCode: generateReferralCode(),
      referredBy: 'cashier-001',
      teamMembers: [],
      joinDate: '2024-09-10T00:00:00Z',
      avatar: AVATARS[3],
      gamesPlayed: 22,
      totalWins: 8,
    },
    {
      id: 'user-003',
      username: 'خالد المحترف',
      email: 'khaled@example.com',
      balance: 250000,
      xp: 8000,
      level: 8,
      role: 'user',
      referralCode: generateReferralCode(),
      referredBy: 'cashier-002',
      teamMembers: [],
      joinDate: '2024-07-20T00:00:00Z',
      avatar: AVATARS[4],
      gamesPlayed: 120,
      totalWins: 55,
    },
  ];
};

const createDefaultGames = (): GameConfig[] => {
  return [
    {
      id: 'classic-slots',
      name: 'سلوتس كلاسيكية',
      category: 'slots',
      coverImage: '',
      backgroundImage: '',
      symbols: [
        { id: 's1', image: '', name: '🍒' },
        { id: 's2', image: '', name: '🍋' },
        { id: 's3', image: '', name: '🍊' },
        { id: 's4', image: '', name: '7️⃣' },
        { id: 's5', image: '', name: '💎' },
      ],
      isActive: true,
      rtp: 96.5,
      minBet: 100,
      maxBet: 100000,
    },
    {
      id: 'fruits-slots',
      name: 'فواكه استوائية',
      category: 'slots',
      coverImage: '',
      backgroundImage: '',
      symbols: [
        { id: 's1', image: '', name: '🍇' },
        { id: 's2', image: '', name: '🍓' },
        { id: 's3', image: '', name: '🍌' },
        { id: 's4', image: '', name: '🥝' },
        { id: 's5', image: '', name: '🌟' },
      ],
      isActive: true,
      rtp: 95.8,
      minBet: 50,
      maxBet: 50000,
    },
    {
      id: 'blackjack',
      name: 'بلاك جاك',
      category: 'table',
      coverImage: '',
      backgroundImage: '',
      symbols: [],
      isActive: true,
      rtp: 99.5,
      minBet: 500,
      maxBet: 500000,
    },
    {
      id: 'roulette',
      name: 'روليت أوروبية',
      category: 'table',
      coverImage: '',
      backgroundImage: '',
      symbols: [],
      isActive: true,
      rtp: 97.3,
      minBet: 100,
      maxBet: 200000,
    },
    {
      id: 'aviator',
      name: 'أفياتور كراش',
      category: 'crash',
      coverImage: '',
      backgroundImage: '',
      symbols: [],
      isActive: true,
      rtp: 97.0,
      minBet: 100,
      maxBet: 100000,
    },
  ];
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [games, setGames] = useState<GameConfig[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<SystemUser | null>(null);

  useEffect(() => {
    const savedUsers = localStorage.getItem('luxeplay_admin_users');
    const savedTransactions = localStorage.getItem('luxeplay_transactions');
    const savedGames = localStorage.getItem('luxeplay_games');
    const savedAdmin = localStorage.getItem('luxeplay_current_admin');

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const defaultUsers = createDefaultUsers();
      setUsers(defaultUsers);
      localStorage.setItem('luxeplay_admin_users', JSON.stringify(defaultUsers));
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

    if (savedGames) {
      setGames(JSON.parse(savedGames));
    } else {
      const defaultGames = createDefaultGames();
      setGames(defaultGames);
      localStorage.setItem('luxeplay_games', JSON.stringify(defaultGames));
    }

    if (savedAdmin) {
      setCurrentAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  const saveUsers = (newUsers: SystemUser[]) => {
    setUsers(newUsers);
    localStorage.setItem('luxeplay_admin_users', JSON.stringify(newUsers));
  };

  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem('luxeplay_transactions', JSON.stringify(newTransactions));
  };

  const saveGames = (newGames: GameConfig[]) => {
    setGames(newGames);
    localStorage.setItem('luxeplay_games', JSON.stringify(newGames));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };
    const updated = [newTransaction, ...transactions];
    saveTransactions(updated);
  };

  const updateUser = (userId: string, updates: Partial<SystemUser>) => {
    const updated = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    saveUsers(updated);
  };

  const addBalanceToUser = (userId: string, amount: number, reason: string) => {
    const user = users.find(u => u.id === userId);
    if (!user || !currentAdmin) return;

    updateUser(userId, { balance: user.balance + amount });
    addTransaction({
      type: 'add',
      fromUserId: currentAdmin.id,
      fromUsername: currentAdmin.username,
      toUserId: userId,
      toUsername: user.username,
      amount,
      reason,
    });
  };

  const deductBalanceFromUser = (userId: string, amount: number, reason: string) => {
    const user = users.find(u => u.id === userId);
    if (!user || !currentAdmin) return;

    updateUser(userId, { balance: Math.max(0, user.balance - amount) });
    addTransaction({
      type: 'deduct',
      fromUserId: currentAdmin.id,
      fromUsername: currentAdmin.username,
      toUserId: userId,
      toUsername: user.username,
      amount,
      reason,
    });
  };

  const changeUserRole = (userId: string, newRole: UserRole, reason: string) => {
    const user = users.find(u => u.id === userId);
    if (!user || !currentAdmin || currentAdmin.role !== 'admin') return;

    const previousRole = user.role;
    
    // If becoming a cashier, generate referral code
    const updates: Partial<SystemUser> = { role: newRole };
    if (newRole === 'cashier' && !user.referralCode) {
      updates.referralCode = generateReferralCode();
    }

    updateUser(userId, updates);
    addTransaction({
      type: 'role_change',
      fromUserId: currentAdmin.id,
      fromUsername: currentAdmin.username,
      toUserId: userId,
      toUsername: user.username,
      reason,
      previousRole,
      newRole,
    });
  };

  const getTeamMembers = (cashierId: string): SystemUser[] => {
    const cashier = users.find(u => u.id === cashierId);
    if (!cashier) return [];
    return users.filter(u => cashier.teamMembers.includes(u.id));
  };

  const transferToCashierTeam = (toUserId: string, amount: number, reason: string) => {
    if (!currentAdmin || currentAdmin.role !== 'cashier') return;
    
    const teamMembers = getTeamMembers(currentAdmin.id);
    const targetUser = teamMembers.find(u => u.id === toUserId);
    if (!targetUser) return;

    // Deduct from cashier
    updateUser(currentAdmin.id, { balance: currentAdmin.balance - amount });
    // Add to team member
    updateUser(toUserId, { balance: targetUser.balance + amount });
    
    addTransaction({
      type: 'transfer',
      fromUserId: currentAdmin.id,
      fromUsername: currentAdmin.username,
      toUserId: toUserId,
      toUsername: targetUser.username,
      amount,
      reason,
    });

    // Update current admin state
    setCurrentAdmin({ ...currentAdmin, balance: currentAdmin.balance - amount });
    localStorage.setItem('luxeplay_current_admin', JSON.stringify({ ...currentAdmin, balance: currentAdmin.balance - amount }));
  };

  const deductFromCashierTeam = (fromUserId: string, amount: number, reason: string) => {
    if (!currentAdmin || currentAdmin.role !== 'cashier') return;
    if (!reason.trim()) return; // Reason is required
    
    const teamMembers = getTeamMembers(currentAdmin.id);
    const targetUser = teamMembers.find(u => u.id === fromUserId);
    if (!targetUser) return;

    // Deduct from team member
    updateUser(fromUserId, { balance: Math.max(0, targetUser.balance - amount) });
    // Add to cashier
    updateUser(currentAdmin.id, { balance: currentAdmin.balance + amount });
    
    addTransaction({
      type: 'deduct',
      fromUserId: currentAdmin.id,
      fromUsername: currentAdmin.username,
      toUserId: fromUserId,
      toUsername: targetUser.username,
      amount,
      reason,
    });

    // Update current admin state
    setCurrentAdmin({ ...currentAdmin, balance: currentAdmin.balance + amount });
    localStorage.setItem('luxeplay_current_admin', JSON.stringify({ ...currentAdmin, balance: currentAdmin.balance + amount }));
  };

  const updateGame = (gameId: string, updates: Partial<GameConfig>) => {
    const updated = games.map(g => g.id === gameId ? { ...g, ...updates } : g);
    saveGames(updated);
  };

  const loginAsAdmin = (username: string): boolean => {
    const user = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      (u.role === 'admin' || u.role === 'cashier')
    );
    
    if (user) {
      setCurrentAdmin(user);
      localStorage.setItem('luxeplay_current_admin', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setCurrentAdmin(null);
    localStorage.removeItem('luxeplay_current_admin');
  };

  const getStats = () => {
    return {
      totalUsers: users.length,
      totalBalance: users.reduce((sum, u) => sum + u.balance, 0),
      totalCashiers: users.filter(u => u.role === 'cashier').length,
      lastTransaction: transactions[0] || null,
    };
  };

  return (
    <AdminContext.Provider value={{
      users,
      transactions,
      games,
      currentAdmin,
      isAdmin: currentAdmin?.role === 'admin',
      isCashier: currentAdmin?.role === 'cashier',
      updateUser,
      addBalanceToUser,
      deductBalanceFromUser,
      changeUserRole,
      getTeamMembers,
      transferToCashierTeam,
      deductFromCashierTeam,
      updateGame,
      loginAsAdmin,
      logoutAdmin,
      getStats,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
