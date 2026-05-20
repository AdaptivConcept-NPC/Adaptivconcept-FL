import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, ChevronRight, RefreshCw, Cpu, Layers } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useArcade } from "../../context/ArcadeContext";

// Local Subcomponents
import PatternForgeHeader from "../../components/games/patternforge/PatternForgeHeader";
import { LEVELS } from "../../components/games/patternforge/levels";
import "./PatternForge.css";

// Reusable Shared components
import PowerUpHUD from "../../components/games/digiarch/PowerUpHUD";
import CompletionScreen from "../../components/games/digiarch/CompletionScreen";
import AuthOverlay from "../../components/games/digiarch/AuthOverlay";
import SettingsOverlay from "../../components/games/digiarch/SettingsOverlay";

const PatternForge = () => {
  const { themeColor } = useTheme();
  const { user, submitScore, getAIHint } = useArcade();

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Level Progression
  const [currentLevel, setCurrentLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState(null); // 'win' | 'fail' | null
  const [gameComplete, setGameComplete] = useState(false);
  const [stars, setStars] = useState([]); // stars per level
  const [shaking, setShaking] = useState(false);

  // AI Hint states
  const [hintText, setHintText] = useState("");
  const [hintError, setHintError] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);

  // Timer & Scores
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(100);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const level = LEVELS[currentLevel];

  // Initialize level states
  useEffect(() => {
    setTimeLeft(45);
    setResult(null);
    setHintText("");
    setHintError("");
    setAttempts(0);
    setShaking(false);
  }, [currentLevel, level]);

  // Countdown timer clock tick
  useEffect(() => {
    if (gameComplete || result === "win" || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setResult("fail");
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameComplete, result]);

  // Sync profile high score when user logs in mid-completion
  useEffect(() => {
    if (gameComplete && user && !scoreSubmitted) {
      const totalStars = stars.reduce((a, b) => a + (b || 0), 0);
      submitScore("patternforge", finalScore, totalStars, finalAccuracy, 135 - totalTimeRemaining)
        .then((res) => {
          if (res.success) setScoreSubmitted(true);
        });
    }
  }, [gameComplete, user, finalScore, finalAccuracy, totalTimeRemaining, scoreSubmitted, stars, submitScore]);

  // Helper to render an SVG polygon of arbitrary sides and rotation angle
  const renderPolygon = (sides, angle, color) => {
    const points = [];
    const radius = 32;
    const cx = 50;
    const cy = 50;

    for (let i = 0; i < sides; i++) {
      // Calculate angular node coordinates offset by rotation angle
      const theta = (i * 2 * Math.PI) / sides + (angle * Math.PI) / 180;
      const x = cx + radius * Math.sin(theta);
      const y = cy - radius * Math.cos(theta); // Subtract to flip Y-axis upwards
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    const pointsStr = points.join(" ");

    return (
      <svg className="w-16 h-16 drop-shadow-[0_0_6px_var(--glow)]" viewBox="0 0 100 100" style={{ "--glow": color }}>
        <polygon
          points={pointsStr}
          fill="rgba(255, 255, 255, 0.05)"
          stroke={color}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Draw vertices */}
        {points.map((pt, idx) => {
          const [px, py] = pt.split(",").map(Number);
          return (
            <circle
              key={idx}
              cx={px}
              cy={py}
              r="2.5"
              fill="#ffffff"
            />
          );
        })}
      </svg>
    );
  };

  // Evaluate selected option
  const handleSelectOption = (opt) => {
    if (result === "win" || timeLeft <= 0) return;

    let isCorrect = false;

    if (level.sequenceType === "shapes") {
      isCorrect = opt.sides === level.target.sides && opt.angle === level.target.angle;
    } else {
      isCorrect = String(opt) === String(level.target);
    }

    if (isCorrect) {
      setResult("win");
      // Calculate stars based on remaining time
      const earnedStars = timeLeft > 30 ? 3 : timeLeft > 15 ? 2 : 1;
      setStars((prev) => {
        const next = [...prev];
        next[currentLevel] = earnedStars;
        return next;
      });
    } else {
      setShaking(true);
      setAttempts((a) => a + 1);
      // Time penalty for incorrect attempts
      setTimeLeft((t) => Math.max(0, t - 5));
      setTimeout(() => setShaking(false), 500);
    }
  };

  const advanceLevel = () => {
    setTotalTimeRemaining((prev) => prev + timeLeft);

    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel((l) => l + 1);
    } else {
      // Calculate game over summary
      const finalAccumTime = totalTimeRemaining + timeLeft;
      const totalStars = stars.reduce((a, b) => a + (b || 0), 0);
      const calculatedScore = totalStars * 1000 + finalAccumTime * 10;
      const calculatedAccuracy = parseFloat((((LEVELS.length) / (LEVELS.length + attempts)) * 100).toFixed(1));

      setFinalScore(calculatedScore);
      setFinalAccuracy(calculatedAccuracy);
      setGameComplete(true);

      if (user) {
        submitScore("patternforge", calculatedScore, totalStars, calculatedAccuracy, 135 - finalAccumTime)
          .then((res) => {
            if (res.success) setScoreSubmitted(true);
          });
      }
    }
  };

  const handleGetHint = async () => {
    setLoadingHint(true);
    setHintError("");
    setHintText("");

    const res = await getAIHint({
      gameId: "patternforge",
      levelId: level.id,
      levelTitle: level.title,
      instruction: level.instruction,
      currentStyles: { attempts, currentSequence: level.sequence },
      targetStyles: level.target,
      attempts: attempts,
    });

    setLoadingHint(false);
    if (res.success) {
      setHintText(res.hint);
    } else {
      setHintError(res.reason);
    }
  };

  const handleRestartLevel = () => {
    setTimeLeft(45);
    setResult(null);
    setShaking(false);
  };

  const resetGame = () => {
    setCurrentLevel(0);
    setStars([]);
    setTotalTimeRemaining(0);
    setGameComplete(false);
    setScoreSubmitted(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="patternforge-page container mx-auto px-6 py-10 md:py-20 min-h-screen rounded-[32px] md:rounded-[60px] glass-theme"
      style={{ marginTop: "200px" }}
    >
      <div className="patternforge-scanlines" />

      {/* Overlays */}
      <AuthOverlay isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <SettingsOverlay isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {gameComplete ? (
        <CompletionScreen
          stars={stars}
          attempts={attempts}
          totalScore={finalScore}
          totalTime={135 - totalTimeRemaining}
          onReset={resetGame}
        />
      ) : (
        <>
          <PatternForgeHeader
            currentLevelIndex={currentLevel}
            totalLevels={LEVELS.length}
            levels={LEVELS}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Level Title & Clock */}
          <div className="text-center mb-8 relative z-10 flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl font-comfortaa font-bold text-high mb-2">
              {level.title}
            </h1>
            <p className="text-low text-xs md:text-sm max-w-xl mx-auto font-mono mb-4">
              {level.instruction}
            </p>

            {/* Alarm Clock HUD */}
            <div
              className={`px-4 py-1.5 rounded-full border font-mono text-xs font-bold transition-colors ${
                timeLeft < 15
                  ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse"
                  : "bg-white/5 border-white/10 text-neutral-300"
              }`}
            >
              ⚡ COGNITIVE CLOCK TICKING: {timeLeft}s
            </div>
          </div>

          {/* Sequence Deck Viewer */}
          <div className="max-w-4xl mx-auto mb-10 relative z-10 flex justify-center">
            <div className={`w-full p-8 rounded-2xl glass-theme border border-white/10 flex flex-col items-center justify-center min-h-[220px] ${shaking ? "shake-animation" : ""}`}>
              {/* Render based on sequence type */}
              {level.sequenceType === "numeric" && (
                <div className="flex flex-wrap justify-center gap-4">
                  {level.sequence.map((num, i) => (
                    <div
                      key={i}
                      className={`w-20 h-20 rounded-xl flex items-center justify-center font-mono text-2xl font-bold border transition-all ${
                        num === "?"
                          ? "border-[#fd3b12] bg-[#fd3b12]/5 text-[#fd3b12] shadow-[0_0_15px_rgba(253,59,18,0.2)] animate-pulse"
                          : "border-white/10 bg-white/5 text-white"
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              )}

              {level.sequenceType === "shapes" && (
                <div className="flex flex-wrap justify-center gap-6">
                  {level.sequence.map((item, i) => {
                    if (item === "?") {
                      return (
                        <div
                          key={`seq-q`}
                          className="w-28 h-32 rounded-xl flex flex-col items-center justify-center border border-[#fd3b12] bg-[#fd3b12]/5 text-[#fd3b12] shadow-[0_0_15px_rgba(253,59,18,0.2)] animate-pulse"
                        >
                          <span className="font-mono text-3xl font-bold">?</span>
                          <span className="text-[9px] font-mono mt-2 tracking-widest text-neutral-400">NEXT</span>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={item.id}
                        className="w-28 h-32 rounded-xl p-3 border border-white/10 bg-white/5 flex flex-col items-center justify-between sequence-card-glass"
                      >
                        {renderPolygon(item.sides, item.angle, item.color)}
                        <div className="text-center font-mono text-[9px] text-neutral-400 leading-tight">
                          <div>{item.sides} SIDES</div>
                          <div>{item.angle}° ROT</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {level.sequenceType === "matrix" && (
                <div className="pattern-matrix-grid w-full max-w-[280px]">
                  {level.matrix.map((row, rIdx) =>
                    row.map((cell, cIdx) => (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`pattern-matrix-cell ${cell === "?" ? "missing animate-pulse" : ""}`}
                      >
                        {cell}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Option selection Grid */}
          <div className="max-w-2xl mx-auto mb-10 relative z-10">
            <h3 className="text-center text-xs font-bold tracking-widest text-[#fd3b12] uppercase mb-4 font-mono">
              SELECT DECODED SEQUENCE COMPLETION:
            </h3>

            <div className="flex flex-wrap justify-center gap-4">
              {level.options.map((opt, i) => {
                if (level.sequenceType === "shapes") {
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt)}
                      disabled={timeLeft <= 0 || result === "win"}
                      className="w-28 h-32 rounded-xl p-3 border border-white/10 bg-white/5 hover:border-[#fd3b12]/50 hover:bg-[#fd3b12]/5 flex flex-col items-center justify-between transition-all"
                    >
                      {renderPolygon(opt.sides, opt.angle, opt.color)}
                      <div className="text-center font-mono text-[9px] text-neutral-400 leading-tight">
                        <div>{opt.sides} SIDES</div>
                        <div>{opt.angle}° ROT</div>
                      </div>
                    </button>
                  );
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt)}
                    disabled={timeLeft <= 0 || result === "win"}
                    className="w-20 h-20 rounded-xl flex items-center justify-center font-mono text-2xl font-bold border border-white/10 bg-white/5 hover:border-[#fd3b12]/50 hover:bg-[#fd3b12]/5 text-white transition-all cursor-pointer"
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit & Navigation controls */}
          <div className="max-w-2xl mx-auto relative z-10 flex flex-col gap-6">
            {/* Status bar */}
            <div className="flex gap-4">
              <button
                onClick={handleRestartLevel}
                className="p-4 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-all"
                title="Reset sequence decoder"
              >
                <RefreshCw size={18} />
              </button>

              <div
                className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 border text-comfortaa select-none"
                style={{
                  backgroundColor:
                    result === "win"
                      ? "rgba(57, 255, 20, 0.15)"
                      : "rgba(255, 255, 255, 0.02)",
                  borderColor:
                    result === "win" ? "#39ff14" : "rgba(255, 255, 255, 0.1)",
                  color: result === "win" ? "#39ff14" : "#neutral-400",
                }}
              >
                {result === "win" ? (
                  <>
                    <Check size={20} /> Correct! Pattern Decoded
                  </>
                ) : (
                  <>
                    <Layers size={18} className="text-[#fd3b12]" /> Decoding Sequence...
                  </>
                )}
              </div>

              {result === "win" && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={advanceLevel}
                  className="px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all font-comfortaa cursor-pointer"
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

            {/* AI Hint Panel */}
            <PowerUpHUD
              attempts={attempts}
              onGetHint={handleGetHint}
              hintText={hintText}
              loadingHint={loadingHint}
              hintError={hintError}
            />
          </div>
        </>
      )}
    </motion.div>
  );
};

export default PatternForge;
