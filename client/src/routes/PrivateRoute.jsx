import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While auth status is being determined, show a spinner or placeholder
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="animate-pulse text-gray-500">
          Checking authentication...
        </div>
      </div>
    );
  }

  if (!user) {
    // Not logged in -> redirect to login and preserve current location
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // User present -> render children (the protected page)
  return children;
}
