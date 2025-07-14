import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RoleBasedRoutesProps {
  children: React.ReactNode;
  requiredRole: string[];
}

const RoleBasedRoutes: React.FC<RoleBasedRoutesProps> = ({
  children,
  requiredRole,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in the required roles
  if (!requiredRole.includes(user.role)) {
    // Redirect based on user's actual role
    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user.role === "employee") {
      return <Navigate to="/employee-dashboard" replace />;
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default RoleBasedRoutes;
