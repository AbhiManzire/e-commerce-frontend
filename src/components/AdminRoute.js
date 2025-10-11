import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.user);

  return userInfo && userInfo.isAdmin ? children : <Navigate to="/login" replace />;
};

export default AdminRoute;
