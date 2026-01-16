import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  balance: number;
  avatar: string;
  level: number;
  xp: number;
  joinDate: string;
  gamesPlayed: number;
  totalWins: number;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string) => void;
  logout: () => void;
  updateBalance: (amount: number) => void;
  addBalance: (amount: number) => void;
  incrementGamesPlayed: () => void;
  incrementWins: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_BALANCE = 100000;
const AVATARS = ['🎰', '🃏', '🎲', '💎', '🏆', '⭐', '🔥', '💰'];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('luxeplay_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const saveUser = (userData: User) => {
    localStorage.setItem('luxeplay_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = (username: string) => {
    const existingUser = localStorage.getItem('luxeplay_user');
    if (existingUser) {
      const parsed = JSON.parse(existingUser);
      if (parsed.username === username) {
        setUser(parsed);
        return;
      }
    }

    const newUser: User = {
      username,
      balance: DEFAULT_BALANCE,
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      level: 1,
      xp: 0,
      joinDate: new Date().toISOString(),
      gamesPlayed: 0,
      totalWins: 0,
    };
    saveUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const newXp = user.xp + Math.abs(amount) * 0.01;
      const newLevel = Math.floor(newXp / 1000) + 1;
      const updatedUser = { 
        ...user, 
        balance: Math.max(0, user.balance + amount),
        xp: newXp,
        level: newLevel,
      };
      saveUser(updatedUser);
    }
  };

  const addBalance = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, balance: user.balance + amount };
      saveUser(updatedUser);
    }
  };

  const incrementGamesPlayed = () => {
    if (user) {
      const updatedUser = { ...user, gamesPlayed: user.gamesPlayed + 1 };
      saveUser(updatedUser);
    }
  };

  const incrementWins = () => {
    if (user) {
      const updatedUser = { ...user, totalWins: user.totalWins + 1 };
      saveUser(updatedUser);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      logout,
      updateBalance,
      addBalance,
      incrementGamesPlayed,
      incrementWins,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
