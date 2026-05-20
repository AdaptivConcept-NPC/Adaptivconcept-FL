import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Cpu, User } from "lucide-react";
import { useArcade } from "../../../context/ArcadeContext";

const NodeFlowHeader = ({ currentLevelIndex, totalLevels, levels, onOpenAuth, onOpenSettings }) => {
  const { user } = useArcade();

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
      <div className="flex items-center gap-2">
        <span className="text-xl">🕸️</span>
        <h2 className="text-sm font-bold font-comfortaa text-[#00ff88] flex items-center gap-2">
          NodeFlow Graph Pathfinder
        </h2>
      </div>

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
                    ? "#00ff88"
                    : i < currentLevelIndex
                      ? "var(--theme-color)"
                      : "var(--glass-border)",
                boxShadow: i === currentLevelIndex ? "0 0 10px #00ff88" : "none",
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-low hover:text-[#00ff88] hover:border-[#00ff88]/30 transition-all"
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
};

export default NodeFlowHeader;
