import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isAuthenticated, setAuthenticated, checkAuth } from '@/lib/store';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const login = (username: string, password: string): boolean => {
    if (checkAuth(username, password)) {
      setAuthenticated(true);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthenticated(false);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
