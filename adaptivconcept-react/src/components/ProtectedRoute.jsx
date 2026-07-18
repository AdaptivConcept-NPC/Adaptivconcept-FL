/**
 * ProtectedRoute.jsx
 * Redirects unauthenticated users to /invoicing/login.
 * Optionally checks that the user has a required role.
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useInvoiceAuth } from "../context/InvoiceAuthContext";

export default function ProtectedRoute({
  children,
  roles = ["admin", "super_admin", "business_owner"],
}) {
  const { user, loading } = useInvoiceAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-2 border-white/20 border-t-[var(--theme-color)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/invoicing/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
