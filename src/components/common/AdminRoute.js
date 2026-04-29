import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-ocean-900"><div className="w-10 h-10 border-4 border-aqua-400 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
};

export default AdminRoute;
