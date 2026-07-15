import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="spinner">Loading...</div>;
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
