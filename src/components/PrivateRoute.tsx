import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useSelector((state: any) => state.auth);
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;