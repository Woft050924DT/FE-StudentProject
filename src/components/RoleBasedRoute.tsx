import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import type { User } from '../models/dto/user.interface';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallbackPath = '/auth/login' 
}) => {
  const user: User | null = AuthService.getStoredUser();
  
  // Kiểm tra xem user có đăng nhập không
  if (!user || !AuthService.isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // Kiểm tra role
  const hasRequiredRole = user.roles.some(role => allowedRoles.includes(role));
  
  if (!hasRequiredRole) {
    // Redirect dựa trên role của user
    if (user.roles.includes('admin')) {
      return <Navigate to="/admin" replace />;
    } else if (user.roles.includes('lecturer') || user.roles.includes('teacher')) {
      return <Navigate to="/lecturer/dashboard" replace />;
    } else if (user.roles.includes('student')) {
      return <Navigate to="/student/dashboard" replace />;
    } else {
      return <Navigate to={fallbackPath} replace />;
    }
  }
  
  return <>{children}</>;
};

export default RoleBasedRoute;
