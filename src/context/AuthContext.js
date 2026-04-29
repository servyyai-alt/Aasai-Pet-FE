import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
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
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('AasaiPet_user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    toast.success(`Welcome back, ${data.name}!`);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password, phone });
    setUser(data);
    localStorage.setItem('AasaiPet_user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    toast.success('Account created successfully!');
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('AasaiPet_user');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out');
  };

  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem('AasaiPet_user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
