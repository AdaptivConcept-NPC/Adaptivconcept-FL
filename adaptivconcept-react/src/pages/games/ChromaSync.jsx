import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, ChevronRight, RefreshCw, Sliders } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useArcade } from "../../context/ArcadeContext";

// Local Subcomponents
import ChromaSyncHeader from "../../components/games/chromasync/ChromaSyncHeader";
import ColorSlider from "../../components/games/chromasync/ColorSlider";
import HarmonyGuide from "../../components/games/chromasync/HarmonyGuide";

// Reusable Shared components from digiarch
import PowerUpHUD from "../../components/games/digiarch/PowerUpHUD";
import CompletionScreen from "../../components/games/digiarch/CompletionScreen";
import AuthOverlay from "../../components/games/digiarch/AuthOverlay";
import SettingsOverlay from "../../components/games/digiarch/SettingsOverlay";

// Config & CSS
import { LEVELS } from "../../components/games/chromasync/levels";
import "./ChromaSync.css";

const ChromaSync = () => {
  const { themeColor } = useTheme();
  const { user, submitScore, getAIHint } = useArcade();

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Level Progression
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerColors, setPlayerColors] = useState([{ H: 180, S: 50, L: 50 }]);
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState(null); // 'win' | 'fail' | null
  const [gameComplete, setGameComplete] = useState(false);
  const [stars, setStars] = useState([]); // stars per level

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
    const initial = level.targets.map(() => ({ H: 180, S: 50, L: 50 }));
    setPlayerColors(initial);
    setActiveColorIdx(0);
    setTimeLeft(60);
    setResult(null);
    setHintText("");
    setHintError("");
    setAttempts(0);
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
      submitScore("chromasync", finalScore, totalStars, finalAccuracy, 180 - totalTimeRemaining)
        .then((res) => {
          if (res.success) setScoreSubmitted(true);
        });
    }
  }, [gameComplete, user, finalScore, finalAccuracy, totalTimeRemaining, scoreSubmitted, stars, submitScore]);

  // Compute accuracy between two colors in HSL space
  const getAccuracy = useCallback((c1, c2) => {
    const diffH = Math.abs(c1.H - c2.H);
    const distH = Math.min(diffH, 360 - diffH) / 180; // 0 to 1
    const distS = Math.abs(c1.S - c2.S) / 100;
    const distL = Math.abs(c1.L - c2.L) / 100;

    const dist = Math.sqrt(0.6 * distH * distH + 0.2 * distS * distS + 0.2 * distL * distL);
    const pct = Math.max(0, (1 - dist) * 100);
    return parseFloat(pct.toFixed(1));
  }, []);

  // Compute current average accuracy
  const currentAccuracy = (() => {
    if (playerColors.length === 0) return 0;
    let sum = 0;
    playerColors.forEach((color, idx) => {
      const target = level.targets[idx];
      if (target) sum += getAccuracy(color, target);
    });
    return parseFloat((sum / playerColors.length).toFixed(1));
  })();

  const handleSliderChange = (val, type) => {
    setPlayerColors((prev) => {
      const next = prev.map((color, idx) => {
        if (idx === activeColorIdx) {
          return { ...color, [type]: val };
        }
        return color;
      });
      return next;
    });
    setResult(null);
  };

  const handleHarmonize = () => {
    if (currentAccuracy >= 90) {
      setResult("win");
      // Calculate stars based on remaining time
      const earnedStars = timeLeft > 40 ? 3 : timeLeft > 20 ? 2 : 1;
      setStars((prev) => {
        const next = [...prev];
        next[currentLevel] = earnedStars;
        return next;
      });
    } else {
      setResult("fail");
      setAttempts((a) => a + 1);
      setTimeout(() => setResult(null), 1200);
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
      const calculatedAccuracy = 95.0; // Simulated aggregate accuracy

      setFinalScore(calculatedScore);
      setFinalAccuracy(calculatedAccuracy);
      setGameComplete(true);

      if (user) {
        submitScore("chromasync", calculatedScore, totalStars, calculatedAccuracy, 180 - finalAccumTime)
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
      gameId: "chromasync",
      levelId: level.id,
      levelTitle: level.title,
      instruction: level.instruction,
      currentStyles: playerColors,
      targetStyles: level.targets,
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
    const initial = level.targets.map(() => ({ H: 180, S: 50, L: 50 }));
    setPlayerColors(initial);
    setActiveColorIdx(0);
    setTimeLeft(60);
    setResult(null);
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
      className="chromasync-page container mx-auto px-6 py-10 md:py-20 min-h-screen rounded-[32px] md:rounded-[60px] glass-theme"
      style={{ marginTop: "200px" }}
    >
      <div className="chromasync-scanlines" />

      {/* Overlays */}
      <AuthOverlay isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <SettingsOverlay isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {gameComplete ? (
        <CompletionScreen
          stars={stars}
          attempts={attempts}
          totalScore={finalScore}
          totalTime={180 - totalTimeRemaining}
          onReset={resetGame}
        />
      ) : (
        <>
          <ChromaSyncHeader
            currentLevelIndex={currentLevel}
            totalLevels={LEVELS.length}
            levels={LEVELS}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Level Title & Clock */}
          <div className="text-center mb-8 relative z-10 flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl font-comfortaa font-bold text-high mb-2">
              <span className="chromasync-glitch" data-text={level.title}>
                {level.title}
              </span>
            </h1>
            <p className="text-low text-xs md:text-sm max-w-xl mx-auto font-mono mb-4">
              {level.instruction}
            </p>

            {/* Alarm clock HUD */}
            <div
              className={`px-4 py-1.5 rounded-full border font-mono text-xs font-bold transition-colors ${
                timeLeft < 15
                  ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse"
                  : "bg-white/5 border-white/10 text-neutral-300"
              }`}
            >
              🚀 SPECTRUM TIME REMAINING: {timeLeft}s
            </div>
          </div>

          {/* Color Mixing Decks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 relative z-10 items-start">
            {/* Control Sliders (Left) */}
            <div className="lg:col-span-5 flex flex-col">
              {/* Element selector for multi-color matching */}
              {playerColors.length > 1 && (
                <div className="flex gap-2 mb-6 bg-white/5 p-1.5 rounded-xl border border-white/10">
                  {playerColors.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveColorIdx(i)}
                      className={`w-full py-2.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        activeColorIdx === i
                          ? "bg-[#bc13fe] text-white shadow-lg shadow-[#bc13fe]/20"
                          : "text-low hover:bg-white/5"
                      }`}
                    >
                      ELEMENT {i === 0 ? "ALPHA" : "BETA"}
                    </button>
                  ))}
                </div>
              )}

              {/* Sliders Box */}
              <div className="glass-theme rounded-2xl p-6 border border-white/10 mb-6">
                <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
                  <Sliders size={16} className="text-[#bc13fe]" />
                  <span className="text-xs font-bold text-low uppercase tracking-widest font-mono">
                    SPECTRUM DYNAMICS
                  </span>
                </div>

                <ColorSlider
                  label="HUE DEGREE"
                  min={0}
                  max={360}
                  value={playerColors[activeColorIdx]?.H || 0}
                  onChange={(val) => handleSliderChange(val, "H")}
                  type="H"
                  currentHSL={playerColors[activeColorIdx] || { H: 0, S: 0, L: 0 }}
                />

                <ColorSlider
                  label="SATURATION LEVEL"
                  min={0}
                  max={100}
                  value={playerColors[activeColorIdx]?.S || 0}
                  onChange={(val) => handleSliderChange(val, "S")}
                  type="S"
                  currentHSL={playerColors[activeColorIdx] || { H: 0, S: 0, L: 0 }}
                />

                <ColorSlider
                  label="LIGHTNESS BALANCE"
                  min={0}
                  max={100}
                  value={playerColors[activeColorIdx]?.L || 0}
                  onChange={(val) => handleSliderChange(val, "L")}
                  type="L"
                  currentHSL={playerColors[activeColorIdx] || { H: 0, S: 0, L: 0 }}
                />
              </div>

              {/* Dynamic Hint Panel */}
              <PowerUpHUD
                attempts={attempts}
                onGetHint={handleGetHint}
                hintText={hintText}
                loadingHint={loadingHint}
                hintError={hintError}
              />
            </div>

            {/* Visual Harmony Wheel & Swatches (Right) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Color swatches side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target color card */}
                <div className="glass-theme rounded-2xl p-5 border border-white/10 flex flex-col items-center">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-3">
                    TARGET SPECTRA
                  </span>

                  <div className="flex gap-2 w-full justify-center">
                    {level.targets.map((tgt, i) => (
                      <div
                        key={i}
                        className="rounded-2xl color-swatch-box transition-all"
                        style={{
                          width: "96px",
                          height: "96px",
                          minWidth: "96px",
                          minHeight: "96px",
                          backgroundColor: `hsl(${tgt.H}, ${tgt.S}%, ${tgt.L}%)`,
                          boxShadow: `0 0 25px hsl(${tgt.H}, ${tgt.S}%, ${tgt.L}%, 0.45)`,
                        }}
                      />
                    ))}
                  </div>

                  {level.baseColor && (
                    <div className="mt-3 text-[10px] font-mono text-neutral-400">
                      Harmonizing base: HSL({level.baseColor.H}°, {level.baseColor.S}%, {level.baseColor.L}%)
                    </div>
                  )}
                </div>

                {/* Mixed player color card */}
                <div className="glass-theme rounded-2xl p-5 border border-white/10 flex flex-col items-center">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-3">
                    MIXED RESONANCE
                  </span>

                  <div className="flex gap-2 w-full justify-center">
                    {playerColors.map((color, i) => (
                      <div
                        key={i}
                        className="rounded-2xl color-swatch-box transition-all"
                        style={{
                          width: "96px",
                          height: "96px",
                          minWidth: "96px",
                          minHeight: "96px",
                          backgroundColor: `hsl(${color.H}, ${color.S}%, ${color.L}%)`,
                          boxShadow: `0 0 25px hsl(${color.H}, ${color.S}%, ${color.L}%, 0.45)`,
                          border: activeColorIdx === i ? "2px solid #ffffff" : "none",
                        }}
                      />
                    ))}
                  </div>

                  <div className="mt-3 text-[10px] font-mono text-neutral-400">
                    Mixed: HSL({playerColors[activeColorIdx]?.H || 0}°, {playerColors[activeColorIdx]?.S || 0}%, {playerColors[activeColorIdx]?.L || 0}%)
                  </div>
                </div>
              </div>

              {/* Angle Spectrum wheel visualizer */}
              <HarmonyGuide level={level} playerColors={playerColors} />
            </div>
          </div>

          {/* Submit controls */}
          <div className="max-w-2xl mx-auto relative z-10">
            {/* Accuracy tracker */}
            <div className="flex items-center justify-between mb-4 px-4 font-mono text-xs">
              <span className="text-low">RESONANCE MATCH ACCURACY:</span>
              <span
                className="font-bold text-sm"
                style={{ color: currentAccuracy >= 90 ? "#39ff14" : "#ff3366" }}
              >
                {currentAccuracy}%
              </span>
            </div>

            {/* Slider track for match status */}
            <div className="w-full bg-white/5 rounded-full h-1.5 mb-6 overflow-hidden border border-white/5">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${currentAccuracy}%`,
                  backgroundColor: currentAccuracy >= 90 ? "#39ff14" : "#bc13fe",
                }}
              />
            </div>

            <div className="flex gap-4">
              {/* Restart current level */}
              <button
                onClick={handleRestartLevel}
                className="p-4 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-all"
                title="Reset Spectrum Mix"
              >
                <RefreshCw size={18} />
              </button>

              <button
                onClick={handleHarmonize}
                disabled={timeLeft <= 0 || result === "win"}
                className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all font-comfortaa border border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                style={{
                  backgroundColor:
                    result === "win"
                      ? "#39ff14"
                      : currentAccuracy >= 90
                        ? "rgba(188, 19, 254, 0.3)"
                        : "rgba(255, 255, 255, 0.05)",
                  color: result === "win" ? "#000" : currentAccuracy >= 90 ? "#bc13fe" : "rgba(255,255,255,0.3)",
                  borderColor: result === "win" ? "#39ff14" : currentAccuracy >= 90 ? "#bc13fe" : "rgba(255,255,255,0.1)",
                  cursor: currentAccuracy >= 90 ? "pointer" : "not-allowed",
                }}
              >
                {result === "win" ? (
                  <>
                    <Check size={20} /> Spectra Harmonized!
                  </>
                ) : result === "fail" ? (
                  <>
                    <X size={20} /> Match Accuracy Too Low (&lt; 90%)
                  </>
                ) : (
                  <>
                    <Zap size={18} /> Harmonize Spectra
                  </>
                )}
              </button>

              {result === "win" && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={advanceLevel}
                  className="px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all font-comfortaa"
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
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ChromaSync;
