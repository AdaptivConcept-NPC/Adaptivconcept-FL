import React from "react";
import { motion } from "framer-motion";
import { NODE_COLORS } from "./levels";

const DigiArchStage = ({ level, userStyles, result }) => {
  // Styles for live and target containers
  const liveStyle = {
    display: "flex",
    ...userStyles,
    width: "100%",
    height: "100%",
    gap: "12px",
    padding: "16px",
    boxSizing: "border-box",
    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const targetStyle = {
    ...level.targetStyle,
    width: "100%",
    height: "100%",
    gap: "12px",
    padding: "16px",
    boxSizing: "border-box",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 relative z-10">
      {/* Your Layout */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-bold text-low tracking-widest uppercase font-poppins">
            Your Layout
          </span>
        </div>
        <div
          className="digiarch-preview-container glass-theme rounded-2xl overflow-hidden"
          style={{
            border:
              result === "win"
                ? "2px solid #39ff14"
                : result === "fail"
                ? "2px solid #ff3366"
                : "1px solid var(--glass-border)",
            boxShadow:
              result === "win"
                ? "0 0 30px rgba(57,255,20,0.3)"
                : result === "fail"
                ? "0 0 30px rgba(255,51,102,0.3)"
                : "none",
          }}
        >
          <div style={liveStyle}>
            {Array.from({ length: level.nodes }).map((_, i) => (
              <motion.div
                key={`live-${i}`}
                layout
                transition={{
                  type: "spring",
                  stiffness: 170,
                  damping: 18,
                }}
                className="digiarch-node"
                style={{
                  backgroundColor: `${NODE_COLORS[i % NODE_COLORS.length]}22`,
                  borderColor: NODE_COLORS[i % NODE_COLORS.length],
                  color: NODE_COLORS[i % NODE_COLORS.length],
                  boxShadow: `0 0 12px ${NODE_COLORS[i % NODE_COLORS.length]}33`,
                }}
              >
                {i + 1}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Layout */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--theme-color)" }}
          />
          <span className="text-xs font-bold text-low tracking-widest uppercase font-poppins">
            Target Layout
          </span>
        </div>
        <div className="digiarch-preview-container glass-theme rounded-2xl overflow-hidden border border-theme opacity-60">
          <div style={targetStyle}>
            {Array.from({ length: level.nodes }).map((_, i) => (
              <div
                key={`target-${i}`}
                className="digiarch-node digiarch-node-target"
                style={{
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigiArchStage;
