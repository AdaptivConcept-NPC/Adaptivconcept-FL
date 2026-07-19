/**
 * InvoiceAuthContext.jsx
 *
 * Auth context for the Adaptivconcept-FL invoicing module.
 * Intentionally namespaced separately from ArcadeContext (different
 * localStorage keys, different purpose) so a session compromise of one
 * cannot be leveraged against the other.
 *
 * Uses the same AI_Codex FastAPI JWT backend.
 * Backend base URL: VITE_INVOICE_API_URL (falls back to VITE_AICODEX_API_URL).
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const BACKEND_BASE = import.meta.env.VITE_INVOICE_API_URL
  || import.meta.env.VITE_AICODEX_API_URL
  || "http://localhost:9000";

const API_BASE = `${BACKEND_BASE}/api`;

const TOKEN_KEY = "invoice_token";
const USER_KEY  = "invoice_user";

const InvoiceAuthContext = createContext(null);

export function InvoiceAuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Verify persisted token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser  = (() => {
      try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
    })();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);

      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Session expired");
          return res.json();
        })
        .then((data) => {
          const refreshed = { username: data.username, id: data.id, role: data.role };
          setUser(refreshed);
          localStorage.setItem(USER_KEY, JSON.stringify(refreshed));
        })
        .catch(() => _clearSession())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  function _clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }

  const login = useCallback(async (username, password) => {
    setAuthError(null);
    try {
      // OAuth2PasswordRequestForm expects form-encoded data, not JSON
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");

      const userData = { username, id: data.id, role: data.role || "user" };
      localStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setToken(data.access_token);
      setUser(userData);
      return { ok: true };
    } catch (err) {
      setAuthError(err.message);
      return { ok: false, error: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    _clearSession();
  }, []);

  return (
    <InvoiceAuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        login,
        logout,
        apiBase: API_BASE,
      }}
    >
      {children}
    </InvoiceAuthContext.Provider>
  );
}

export function useInvoiceAuth() {
  const ctx = useContext(InvoiceAuthContext);
  if (!ctx) throw new Error("useInvoiceAuth must be used inside InvoiceAuthProvider");
  return ctx;
}

export default InvoiceAuthProvider;
