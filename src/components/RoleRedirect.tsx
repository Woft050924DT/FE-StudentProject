import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import type { User } from '../models/dto/user.interface';

const RoleRedirect: React.FC = () => {
  const user: User | null = AuthService.getStoredUser();
  
  if (!user || !AuthService.isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // Redirect dựa trên role
  if (user.roles.includes('admin')) {
    return <Navigate to="/admin" replace />;
  } else if (user.roles.includes('lecturer') || user.roles.includes('teacher')) {
    return <Navigate to="/lecturer/dashboard" replace />;
  } else if (user.roles.includes('student')) {
    return <Navigate to="/student/dashboard" replace />;
  } else {
    return <Navigate to="/profile" replace />;
  }
};

export default RoleRedirect;
