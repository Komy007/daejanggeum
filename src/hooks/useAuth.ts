'use client';

import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  tier: 'Free' | 'Regular' | 'Special';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('camko_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem('camko_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    if (email && password.length >= 4) {
      const mockUser: User = {
        id: 'user_123',
        email: email,
        name: email.split('@')[0],
        tier: 'Free'
      };
      saveUser(mockUser);
      return true;
    }
    return false;
  }, []);

  const signup = useCallback((name: string, email: string, password: string): boolean => {
    if (name && email && password.length >= 4) {
      const mockUser: User = {
        id: 'user_' + Date.now(),
        email: email,
        name: name,
        tier: 'Free'
      };
      saveUser(mockUser);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('camko_user');
  }, []);

  const saveUser = (u: User) => {
    setUser(u);
    setIsLoggedIn(true);
    localStorage.setItem('camko_user', JSON.stringify(u));
  };

  const updateTier = useCallback((tier: 'Free' | 'Regular' | 'Special') => {
    if (user) {
      const updated = { ...user, tier };
      saveUser(updated);
    }
  }, [user]);

  return {
    user,
    isLoggedIn,
    loading,
    login,
    signup,
    logout,
    updateTier
  };
}
