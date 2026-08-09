import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInvoiceAuth } from "../../context/InvoiceAuthContext";

export default function InvoiceLogin() {
  const { login, loading } = useInvoiceAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]   = useState("");
  const [busy, setBusy]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const result = await login(username, password);
    setBusy(false);
    if (result.ok) {
      navigate("/invoicing", { replace: true });
    } else {
      setError(result.error || "Invalid credentials.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg-dark)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full glass-theme p-10 rounded-[40px] text-center"
      >
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border"
          style={{
            background: "rgba(var(--theme-color-rgb), 0.1)",
            borderColor: "rgba(var(--theme-color-rgb), 0.2)",
          }}
        >
          <Lock size={32} style={{ color: "var(--theme-color)" }} />
        </div>

        <h1 className="text-3xl font-comfortaa font-bold text-white mb-1">
          Invoicing Portal
        </h1>
        <p className="text-gray-400 text-sm mb-8 font-poppins">
          Adaptivconcept FL — Business Access
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
              placeholder="your-username"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 font-bold rounded-2xl transition-all disabled:opacity-50"
            style={{ background: "var(--theme-color)", color: "var(--on-theme-text, #ffffff)" }}
          >
            {busy ? "Authenticating…" : "Access Portal"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
