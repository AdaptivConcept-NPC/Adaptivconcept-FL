import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, LogOut, Settings, Database } from "lucide-react";
import { useArcade } from "../../../context/ArcadeContext";

const DigiArchHeader = ({ currentLevelIndex, totalLevels, levels, onOpenAuth, onOpenSettings }) => {
  const { user, logout } = useArcade();

  return (
    <div className="flex items-center justify-between mb-8 relative z-10 flex-wrap gap-4 px-2">
      <Link
        to="/arcade"
        className="flex items-center gap-2 text-low hover:text-high transition-colors text-sm font-poppins"
      >
        <ArrowLeft size={16} />
        Back to Arcade
      </Link>

      {/* Progress Dots */}
      <div className="flex items-center gap-3">
        {levels.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-350 ${
              i === currentLevelIndex
                ? "scale-125"
                : i < currentLevelIndex
                ? "opacity-80"
                : "opacity-20"
            }`}
            style={{
              backgroundColor:
                i === currentLevelIndex
                  ? "#39ff14"
                  : i < currentLevelIndex
                  ? "var(--theme-color)"
                  : "var(--glass-border)",
              boxShadow: i === currentLevelIndex ? "0 0 10px #39ff14" : "none",
            }}
            title={`Level ${i + 1}`}
          />
        ))}
      </div>

      {/* Identity & BYOK HUD */}
      <div className="flex items-center gap-3 text-xs">
        {user ? (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-[#39ff14] px-3 py-1.5 rounded-lg font-mono">
            <Database size={12} className="animate-pulse" />
            <span>Synced: {user.username}</span>
            <button
              onClick={logout}
              title="Logout"
              className="text-low hover:text-high transition-colors ml-1 focus:outline-none"
            >
              <LogOut size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg font-mono hover:bg-amber-500/25 transition-all"
          >
            <User size={12} />
            <span>Guest (Sync Score)</span>
          </button>
        )}

        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-low hover:text-high transition-all"
          title="AI Settings"
        >
          <Settings size={14} />
        </button>
      </div>
    </div>
  );
};

export default DigiArchHeader;
