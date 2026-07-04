import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ requireOrg = true }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasOrg = !!user?.organization_id;

  // If the route requires an organization and the user doesn't have one
  if (requireOrg && !hasOrg) {
    return <Navigate to="/setup-organization" replace />;
  }

  // If the user already has an organization, don't let them access setup page again
  if (!requireOrg && hasOrg && location.pathname === '/setup-organization') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
