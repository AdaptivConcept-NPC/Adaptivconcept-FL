import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Sparkles, Loader2 } from "lucide-react";
import { useArcade } from "../../../context/ArcadeContext";

const PowerUpHUD = ({ attempts, onGetHint, hintText, loadingHint, hintError }) => {
  const { provider } = useArcade();

  return (
    <div className="mb-6 relative z-10">
      {/* HUD Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-low font-mono font-bold tracking-widest uppercase">
          Attempts: <span className="text-[#39ff14]">{attempts}</span>
        </span>

        <button
          onClick={onGetHint}
          disabled={loadingHint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingHint ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Sparkles size={12} />
          )}
          <span>Get AI Insight</span>
        </button>
      </div>

      {/* Hint Output Panel */}
      <AnimatePresence>
        {(hintText || hintError) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-theme rounded-xl p-4 border overflow-hidden"
            style={{
              borderColor: hintError ? "rgba(239, 68, 68, 0.3)" : "rgba(255, 204, 0, 0.25)",
              backgroundColor: hintError ? "rgba(239, 68, 68, 0.05)" : "rgba(255, 204, 0, 0.03)",
            }}
          >
            <div className="flex items-start gap-3">
              <Lightbulb
                size={18}
                className="mt-0.5 flex-shrink-0"
                style={{ color: hintError ? "#ef4444" : "#ffcc00" }}
              />
              <div className="flex-1">
                <span className="text-[10px] font-bold font-mono tracking-wider uppercase block mb-1 text-low">
                  {hintError ? "Insight Error" : `AI Codex Insight (${provider})`}
                </span>
                <p
                  className="text-xs font-mono leading-relaxed"
                  style={{ color: hintError ? "#ef4444" : "#ffcc00" }}
                >
                  {hintError || hintText}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PowerUpHUD;
