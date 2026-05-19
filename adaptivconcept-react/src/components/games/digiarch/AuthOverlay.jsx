import React, { useState } from "react";
import { X, Key, User, Mail, Database, Loader2 } from "lucide-react";
import { useArcade } from "../../../context/ArcadeContext";

const AuthOverlay = ({ isOpen, onClose }) => {
  const { login, register, authError } = useArcade();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setLocalError("Username and password are required.");
      setLoading(false);
      return;
    }

    let success = false;
    if (isRegister) {
      if (!email.trim()) {
        setLocalError("Email is required for registration.");
        setLoading(false);
        return;
      }
      success = await register(username.trim(), email.trim(), password.trim());
    } else {
      success = await login(username.trim(), password.trim());
    }

    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <div className="w-full max-w-md glass-theme rounded-2xl border border-white/10 p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-low hover:text-high transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Database size={20} className="text-[#39ff14]" />
          <h2 className="text-lg font-bold font-comfortaa text-high">
            Connect AI_Codex Profile
          </h2>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/5 mb-6">
          <button
            onClick={() => {
              setIsRegister(false);
              setLocalError("");
            }}
            className={`flex-1 pb-3 text-sm font-poppins font-bold transition-all border-b-2 ${
              !isRegister
                ? "border-[#39ff14] text-high"
                : "border-transparent text-low hover:text-high"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsRegister(true);
              setLocalError("");
            }}
            className={`flex-1 pb-3 text-sm font-poppins font-bold transition-all border-b-2 ${
              isRegister
                ? "border-[#39ff14] text-high"
                : "border-transparent text-low hover:text-high"
            }`}
          >
            Create Profile
          </button>
        </div>

        {/* Error Messages */}
        {(localError || authError) && (
          <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono">
            {localError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-low uppercase tracking-wider block mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-low" size={14} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-sm font-mono text-high focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14]/30"
                placeholder="Developer username"
                required
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-xs font-mono text-low uppercase tracking-wider block mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-low" size={14} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-sm font-mono text-high focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14]/30"
                  placeholder="dev@aicodex.io"
                  required={isRegister}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-mono text-low uppercase tracking-wider block mb-1">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3.5 text-low" size={14} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-sm font-mono text-high focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14]/30"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-adaptiv-orange text-white py-3.5 rounded-xl font-comfortaa font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <span>{isRegister ? "Register & Sync" : "Sync Profile"}</span>
            )}
          </button>
        </form>

        <p className="text-[10px] text-low font-mono text-center mt-6 uppercase tracking-wider">
          Score synced directly to AI_Codex SQLite database.
        </p>
      </div>
    </div>
  );
};

export default AuthOverlay;
