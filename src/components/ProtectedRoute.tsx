import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from 'utils/authService';
import UnauthorizedPage from "./UnauthorizedPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireRestaurantAdmin?: boolean;
  requireDeliveryPerson?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin,
  requireRestaurantAdmin,
  requireDeliveryPerson,
}: ProtectedRouteProps) {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  const isRestaurantAdmin = authService.isRestaurantAdmin();
  const isDeliveryPerson = authService.isDeliveryPerson();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Show unauthorized page if not admin
    return <Navigate to="/unauthorized" replace />;
  }

  if (requireRestaurantAdmin && !isRestaurantAdmin && !isAdmin) {
    // Show unauthorized page if not restaurant admin or admin
    return <Navigate to="/unauthorized" replace />;
  }

  if (requireDeliveryPerson && !isDeliveryPerson && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
} 