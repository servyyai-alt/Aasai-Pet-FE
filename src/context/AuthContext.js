import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('AasaiPet_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('AasaiPet_user', JSON.stringify(data));
    toast.success(`Welcome back, ${data.name}!`);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    setUser(data);
    localStorage.setItem('AasaiPet_user', JSON.stringify(data));
    toast.success('Account created successfully!');
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('AasaiPet_user');
    toast.success('Logged out');
  };

  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem('AasaiPet_user', JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
