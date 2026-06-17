import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Cpu, User, LogOut, Settings, Database } from "lucide-react";
import { useArcade } from "../../context/ArcadeContext";

const GameHeader = ({
  title,
  emoji,
  themeColor = "#bc13fe",
  currentLevelIndex,
  levels,
  onOpenAuth,
  onOpenSettings,
  isClassicLayout = true
}) => {
  const { user, logout } = useArcade();

  if (isClassicLayout) {
    return (
      <div className="flex items-center justify-between mb-8 relative z-10 flex-wrap gap-4 select-none">
        {/* Back button */}
        <Link
          to="/arcade"
          className="flex items-center gap-2 text-low hover:text-high transition-colors text-sm font-mono"
        >
          <ArrowLeft size={16} />
          <span>BACK TO ARCADE</span>
        </Link>

        {/* Title */}
        {title && (
          <div className="flex items-center gap-2">
            {emoji && <span className="text-xl">{emoji}</span>}
            <h2 
              className="text-sm font-bold font-comfortaa flex items-center gap-2"
              style={{ color: themeColor }}
            >
              {title}
            </h2>
          </div>
        )}

        {/* Progress Dots & Buttons */}
        <div className="flex items-center gap-6">
          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {levels.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentLevelIndex
                    ? "scale-125"
                    : i < currentLevelIndex
                      ? ""
                      : "opacity-30"
                }`}
                style={{
                  backgroundColor:
                    i === currentLevelIndex
                      ? themeColor
                      : i < currentLevelIndex
                        ? "var(--theme-color)"
                        : "var(--glass-border)",
                  boxShadow: i === currentLevelIndex ? `0 0 10px ${themeColor}` : "none",
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-low hover:text-[var(--hover-color)] hover:border-[var(--hover-color)]/30 transition-all"
              style={{
                "--hover-color": themeColor
              }}
              title="Configure AI Hint Engine"
            >
              <Cpu size={15} />
            </button>
            
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                user
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-white/5 border-white/10 text-low hover:text-high hover:border-white/20"
              }`}
            >
              <User size={12} />
              <span>{user ? user.username : "Sync Profile"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    // DigiArch layout
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
                    ? themeColor
                    : i < currentLevelIndex
                    ? "var(--theme-color)"
                    : "var(--glass-border)",
                boxShadow: i === currentLevelIndex ? `0 0 10px ${themeColor}` : "none",
              }}
              title={`Level ${i + 1}`}
            />
          ))}
        </div>

        {/* Identity & BYOK HUD */}
        <div className="flex items-center gap-3 text-xs">
          {user ? (
            <div 
              className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-lg font-mono"
              style={{ color: themeColor }}
            >
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
  }
};

export default GameHeader;
