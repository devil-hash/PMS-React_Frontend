import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];          // e.g., ['admin'], ['manager']
  allowedDepartments?: string[];    // e.g., ['human resource']
  excludeRoles?: string[];          // e.g., ['admin']
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [],
  allowedDepartments = [],
  excludeRoles = [],
}) => {
  const userRole = localStorage.getItem('userRole')?.toLowerCase() || '';
  const userDept = localStorage.getItem('userDepartment')?.toLowerCase() || '';

  // Exclude blocked roles
  if (excludeRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Allow based on role
  if (allowedRoles.length > 0 && allowedRoles.includes(userRole)) {
    return <Outlet />;
  }

  // Allow based on department
  if (allowedDepartments.length > 0 && allowedDepartments.includes(userDept)) {
    return <Outlet />;
  }

  // Unauthorized
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
