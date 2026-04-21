import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  RotateCcw,
  ChevronRight,
  Check,
  X,
  Lightbulb,
  Zap,
  Trophy,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./DigiArch.css";

/* ═══════════════════════════════════════════════════════════
   LEVEL DEFINITIONS
   ═══════════════════════════════════════════════════════════ */
const LEVELS = [
  {
    id: 1,
    title: "Vertical Stack",
    instruction: "Stack all nodes vertically, centered in the container.",
    targetStyle: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    controls: [
      {
        property: "flexDirection",
        label: "flex-direction",
        options: ["row", "column", "row-reverse", "column-reverse"],
      },
      {
        property: "alignItems",
        label: "align-items",
        options: ["flex-start", "center", "flex-end", "stretch"],
      },
    ],
    nodes: 3,
    hint: 'Set flex-direction to "column" and align-items to "center".',
  },
  {
    id: 2,
    title: "Spread Out",
    instruction: "Spread nodes across the row with equal space between them.",
    targetStyle: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    controls: [
      {
        property: "justifyContent",
        label: "justify-content",
        options: [
          "flex-start",
          "center",
          "flex-end",
          "space-between",
          "space-around",
          "space-evenly",
        ],
      },
      {
        property: "alignItems",
        label: "align-items",
        options: ["flex-start", "center", "flex-end", "stretch"],
      },
    ],
    nodes: 4,
    hint: 'Use justify-content: "space-between" and align-items: "center".',
  },
  {
    id: 3,
    title: "Reverse Corner",
    instruction:
      "Reverse the row order and push everything to the bottom-right.",
    targetStyle: {
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: "flex-start",
      alignItems: "flex-end",
    },
    controls: [
      {
        property: "flexDirection",
        label: "flex-direction",
        options: ["row", "column", "row-reverse", "column-reverse"],
      },
      {
        property: "justifyContent",
        label: "justify-content",
        options: [
          "flex-start",
          "center",
          "flex-end",
          "space-between",
          "space-around",
        ],
      },
      {
        property: "alignItems",
        label: "align-items",
        options: ["flex-start", "center", "flex-end", "stretch"],
      },
    ],
    nodes: 3,
    hint: 'Set flex-direction: "row-reverse", justify-content: "flex-start", align-items: "flex-end".',
  },
  {
    id: 4,
    title: "Wrap Grid",
    instruction: "Wrap nodes into a 2-row grid, evenly spaced.",
    targetStyle: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    controls: [
      {
        property: "flexWrap",
        label: "flex-wrap",
        options: ["nowrap", "wrap", "wrap-reverse"],
      },
      {
        property: "justifyContent",
        label: "justify-content",
        options: [
          "flex-start",
          "center",
          "flex-end",
          "space-between",
          "space-around",
          "space-evenly",
        ],
      },
      {
        property: "alignItems",
        label: "align-items",
        options: ["flex-start", "center", "flex-end", "stretch"],
      },
    ],
    nodes: 6,
    hint: 'Set flex-wrap: "wrap", justify-content: "space-evenly", align-items: "center".',
  },
];

const NODE_COLORS = ["#39ff14", "#00f2ff", "#ff6600", "#bc13fe", "#ff3366", "#ffcc00"];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
const DigiArch = () => {
  const { themeColor } = useTheme();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userStyles, setUserStyles] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null); // 'win' | 'fail' | null
  const [gameComplete, setGameComplete] = useState(false);
  const [stars, setStars] = useState([]); // stars per level

  const level = LEVELS[currentLevel];

  // Init controls for this level
  useEffect(() => {
    const initial = {};
    level.controls.forEach((c) => {
      initial[c.property] = c.options[0];
    });
    setUserStyles(initial);
    setAttempts(0);
    setShowHint(false);
    setResult(null);
  }, [currentLevel]);

  const handleControlChange = useCallback((property, value) => {
    setUserStyles((prev) => ({ ...prev, [property]: value }));
    setResult(null);
  }, []);

  const checkSolution = useCallback(() => {
    const target = level.targetStyle;
    let correct = true;

    // Check each control property
    for (const ctrl of level.controls) {
      if (userStyles[ctrl.property] !== target[ctrl.property]) {
        correct = false;
        break;
      }
    }

    // Also check properties not in controls but in target (e.g., flexWrap)
    for (const key of Object.keys(target)) {
      if (key === "display") continue;
      if (
        !level.controls.find((c) => c.property === key) &&
        userStyles[key] !== target[key]
      ) {
        // If the property is in the target but not a control, auto-check
        // We need to also match the flexWrap etc.
        if (target[key] !== undefined) {
          const ctrl = level.controls.find((c) => c.property === key);
          if (ctrl && userStyles[key] !== target[key]) {
            correct = false;
            break;
          }
        }
      }
    }

    if (correct) {
      setResult("win");
      // Calculate stars
      const s = attempts === 0 ? 3 : attempts < 3 ? 2 : 1;
      setStars((prev) => {
        const next = [...prev];
        next[currentLevel] = s;
        return next;
      });
    } else {
      setResult("fail");
      setAttempts((a) => a + 1);
      if (attempts >= 2) setShowHint(true);
      // Clear fail after 1 second
      setTimeout(() => setResult(null), 1200);
    }
  }, [userStyles, level, attempts, currentLevel]);

  const advanceLevel = () => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel((l) => l + 1);
    } else {
      setGameComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentLevel(0);
    setStars([]);
    setGameComplete(false);
  };

  // Build the live preview style
  const liveStyle = {
    display: "flex",
    ...userStyles,
    width: "100%",
    height: "100%",
    gap: "8px",
    padding: "8px",
    boxSizing: "border-box",
    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  // Target preview style
  const targetPreviewStyle = {
    ...level.targetStyle,
    width: "100%",
    height: "100%",
    gap: "8px",
    padding: "8px",
    boxSizing: "border-box",
  };

  if (gameComplete) {
    const totalStars = stars.reduce((a, b) => a + (b || 0), 0);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="digiarch-page container mx-auto px-6 py-10 md:py-20 min-h-screen rounded-[32px] md:rounded-[60px] glass-theme"
        style={{ marginTop: "200px", backgroundColor: "var(--glass-bg)" }}
      >
        <div className="digiarch-scanlines" />
        <div className="text-center relative z-10 py-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Trophy size={80} style={{ color: "#ffcc00", margin: "0 auto 24px" }} />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-comfortaa font-bold text-high mb-4">
            System <span className="text-adaptiv-orange">Stabilized</span>
          </h1>
          <p className="text-xl text-low mb-8">
            All architectures aligned. You earned{" "}
            <span style={{ color: "#ffcc00", fontWeight: 700 }}>{totalStars}</span> / {LEVELS.length * 3} stars.
          </p>
          <div className="flex justify-center gap-3 mb-12">
            {stars.map((s, i) => (
              <div key={i} className="flex gap-1">
                {[1, 2, 3].map((n) => (
                  <Star
                    key={n}
                    size={20}
                    fill={n <= (s || 0) ? "#ffcc00" : "transparent"}
                    stroke={n <= (s || 0) ? "#ffcc00" : "rgba(255,255,255,0.2)"}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={resetGame}
              className="px-8 py-3 rounded-xl font-bold btn-adaptive-hover transition-all border"
              style={{ borderColor: "var(--glass-border)", color: "var(--text-h)" }}
            >
              <RotateCcw size={16} className="inline mr-2" />
              Play Again
            </button>
            <Link
              to="/arcade"
              className="px-8 py-3 rounded-xl font-bold transition-all"
              style={{
                backgroundColor: "var(--theme-color)",
                color: themeColor.washType === "light" ? "#000" : "#fff",
              }}
            >
              Back to Arcade
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="digiarch-page container mx-auto px-6 py-10 md:py-20 min-h-screen rounded-[32px] md:rounded-[60px] glass-theme"
      style={{ marginTop: "200px", backgroundColor: "var(--glass-bg)" }}
    >
      {/* Scanlines */}
      <div className="digiarch-scanlines" />

      {/* Header */}
      <div className="flex items-center justify-between mb-10 relative z-10 flex-wrap gap-4">
        <Link
          to="/arcade"
          className="flex items-center gap-2 text-low hover:text-high transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          Arcade
        </Link>

        {/* Progress dots */}
        <div className="flex items-center gap-3">
          {LEVELS.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentLevel
                  ? "scale-125"
                  : i < currentLevel
                  ? ""
                  : "opacity-30"
              }`}
              style={{
                backgroundColor:
                  i === currentLevel
                    ? "#39ff14"
                    : i < currentLevel
                    ? "var(--theme-color)"
                    : "var(--glass-border)",
                boxShadow:
                  i === currentLevel ? "0 0 10px #39ff14" : "none",
              }}
            />
          ))}
        </div>

        <span className="text-low text-xs font-bold tracking-widest uppercase">
          Level {level.id}/{LEVELS.length}
        </span>
      </div>

      {/* Level Title & Instruction */}
      <div className="text-center mb-10 relative z-10">
        <h1 className="text-3xl md:text-5xl font-comfortaa font-bold text-high mb-3">
          <span className="digiarch-glitch" data-text={level.title}>
            {level.title}
          </span>
        </h1>
        <p className="text-low text-sm md:text-base max-w-xl mx-auto font-poppins">
          {level.instruction}
        </p>
      </div>

      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 relative z-10">
        {/* Live Preview */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-low tracking-widest uppercase">
              Your Layout
            </span>
          </div>
          <div
            className="digiarch-preview-container glass-theme rounded-2xl overflow-hidden"
            style={{
              border: result === "win"
                ? "2px solid #39ff14"
                : result === "fail"
                ? "2px solid #ff3366"
                : "1px solid var(--glass-border)",
              boxShadow: result === "win"
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

        {/* Target Preview */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--theme-color)" }}
            />
            <span className="text-xs font-bold text-low tracking-widest uppercase">
              Target Layout
            </span>
          </div>
          <div className="digiarch-preview-container glass-theme rounded-2xl overflow-hidden border border-theme opacity-60">
            <div style={targetPreviewStyle}>
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

      {/* Controls */}
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="glass-theme rounded-2xl p-6 md:p-8 mb-6">
          <h3 className="text-xs font-bold tracking-widest uppercase text-low mb-6 flex items-center gap-2">
            <Zap size={14} style={{ color: "var(--theme-color)" }} />
            CSS Controls
          </h3>

          <div className="space-y-5">
            {level.controls.map((ctrl) => (
              <div key={ctrl.property}>
                <label className="text-sm font-mono text-high mb-2 block">
                  <span style={{ color: "#39ff14" }}>{ctrl.label}</span>:
                </label>
                <div className="flex flex-wrap gap-2">
                  {ctrl.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleControlChange(ctrl.property, opt)}
                      className={`digiarch-control-btn px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                        userStyles[ctrl.property] === opt
                          ? "active"
                          : "glass-theme text-low hover:text-high"
                      }`}
                      style={
                        userStyles[ctrl.property] === opt
                          ? {
                              backgroundColor: "rgba(57,255,20,0.2)",
                              color: "#39ff14",
                              borderColor: "rgba(57,255,20,0.5)",
                            }
                          : {}
                      }
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-theme rounded-xl p-4 mb-6 border"
              style={{ borderColor: "rgba(255,204,0,0.3)" }}
            >
              <div className="flex items-start gap-3">
                <Lightbulb
                  size={18}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: "#ffcc00" }}
                />
                <p className="text-sm font-mono" style={{ color: "#ffcc00" }}>
                  {level.hint}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={checkSolution}
            disabled={result === "win"}
            className="digiarch-submit-btn flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            style={{
              backgroundColor: result === "win" ? "#39ff14" : "var(--theme-color)",
              color:
                result === "win"
                  ? "#000"
                  : themeColor.washType === "light"
                  ? "#000"
                  : "#fff",
            }}
          >
            {result === "win" ? (
              <>
                <Check size={20} /> Correct!
              </>
            ) : result === "fail" ? (
              <>
                <X size={20} /> Not quite...
              </>
            ) : (
              <>
                <Zap size={18} /> Submit
              </>
            )}
          </button>

          {result === "win" && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={advanceLevel}
              className="px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all"
              style={{
                backgroundColor: "#39ff14",
                color: "#000",
              }}
            >
              {currentLevel < LEVELS.length - 1 ? "Next Level" : "Finish"}
              <ChevronRight size={18} />
            </motion.button>
          )}
        </div>

        {/* Attempt counter */}
        <div className="text-center mt-4">
          <span className="text-xs text-low">
            Attempts: {attempts} {attempts >= 3 && !showHint ? "" : ""}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DigiArch;
