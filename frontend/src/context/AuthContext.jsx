import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, loginUser, registerUser, logoutUser } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await getMe();
      setUser(data.user);
    } catch {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name}!`);
    return data;
  };

  const register = async (userData) => {
    const { data } = await registerUser(userData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    toast.success('Account created successfully!');
    return data;
  };

  const logout = async () => {
    try { await logoutUser(); } catch {}
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
