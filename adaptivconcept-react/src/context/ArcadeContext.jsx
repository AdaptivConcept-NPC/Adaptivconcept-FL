import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const ArcadeContext = createContext();

// Base URL for the AI_Codex backend API
const BACKEND_BASE_URL = import.meta.env.VITE_AICODEX_API_URL || "http://localhost:9000";
const API_BASE = `${BACKEND_BASE_URL}/api/v1`;

export const ArcadeProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // BYOK States (saved to portfolio's localStorage)
  const [provider, setProvider] = useState(() => localStorage.getItem("arcade_provider") || "gemini");
  const [model, setModel] = useState(() => localStorage.getItem("arcade_model") || "gemini-1.5-flash");
  const [apiKeys, setApiKeys] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("arcade_api_keys")) || {};
    } catch {
      return {};
    }
  });

  // Verify token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("arcade_token");
    const savedUsername = localStorage.getItem("arcade_username");
    
    if (savedToken && savedUsername) {
      setToken(savedToken);
      setUser({ username: savedUsername });
      
      // Verify token authenticity withbackend
      fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Session expired");
          return res.json();
        })
        .then((data) => {
          setUser({ username: data.username, id: data.id, role: data.role });
        })
        .catch(() => {
          // Token expired or server unreachable
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Update localStorage when BYOK config changes
  useEffect(() => {
    localStorage.setItem("arcade_provider", provider);
  }, [provider]);

  useEffect(() => {
    localStorage.setItem("arcade_model", model);
  }, [model]);

  useEffect(() => {
    localStorage.setItem("arcade_api_keys", JSON.stringify(apiKeys));
  }, [apiKeys]);

  const updateApiKey = useCallback((targetProvider, key) => {
    setApiKeys((prev) => ({
      ...prev,
      [targetProvider]: key,
    }));
  }, []);

  const login = useCallback(async (username, password) => {
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Login failed");
      }
      
      localStorage.setItem("arcade_token", data.access_token);
      localStorage.setItem("arcade_username", username);
      setToken(data.access_token);
      setUser({ username });
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Registration failed");
      }
      
      // Automatically log in after registration
      localStorage.setItem("arcade_token", data.access_token);
      localStorage.setItem("arcade_username", username);
      setToken(data.access_token);
      setUser({ username });
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("arcade_token");
    localStorage.removeItem("arcade_username");
    setToken(null);
    setUser(null);
  }, []);

  const submitScore = useCallback(async (gameId, score, starsEarned, accuracy, timeSpentSec) => {
    if (!token) return { success: false, reason: "Unauthorized" };
    
    try {
      const res = await fetch(`${API_BASE}/arcade/score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          game_id: gameId,
          score,
          stars_earned: starsEarned,
          accuracy,
          time_spent_sec: timeSpentSec,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to submit score");
      }
      return { success: true };
    } catch (err) {
      console.error("Score submission error:", err);
      return { success: false, reason: err.message };
    }
  }, [token]);

  const fetchLeaderboard = useCallback(async (gameId, limit = 10) => {
    try {
      const res = await fetch(`${API_BASE}/arcade/leaderboard/${gameId}?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return await res.json();
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      return [];
    }
  }, []);

  const getAIHint = useCallback(async ({ gameId, levelId, levelTitle, instruction, currentStyles, targetStyles, attempts }) => {
    const activeKey = apiKeys[provider] || "";
    if (!activeKey.trim()) {
      return { success: false, reason: `API key for ${provider} is missing. Please configure it in Arcade Settings.` };
    }
    
    try {
      const res = await fetch(`${API_BASE}/arcade/hint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "", // optional auth for hint, but requires API key
        },
        body: JSON.stringify({
          game_id: gameId,
          level_id: levelId,
          level_title: levelTitle,
          instruction,
          current_styles: currentStyles,
          target_styles: targetStyles,
          attempts,
          provider,
          model,
          api_key: activeKey,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to get AI hint");
      }
      return { success: true, hint: data.hint };
    } catch (err) {
      console.error("AI Hint error:", err);
      return { success: false, reason: err.message };
    }
  }, [apiKeys, provider, model, token]);

  return (
    <ArcadeContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        provider,
        model,
        apiKeys,
        setProvider,
        setModel,
        updateApiKey,
        login,
        register,
        logout,
        submitScore,
        fetchLeaderboard,
        getAIHint,
        backendBaseUrl: BACKEND_BASE_URL,
      }}
    >
      {children}
    </ArcadeContext.Provider>
  );
};

export const useArcade = () => {
  const context = useContext(ArcadeContext);
  if (!context) {
    throw new Error("useArcade must be used within an ArcadeProvider");
  }
  return context;
};
