import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useArcade } from "../../context/ArcadeContext";

// Subcomponents
import DigiArchHeader from "../../components/games/digiarch/DigiArchHeader";
import DigiArchStage from "../../components/games/digiarch/DigiArchStage";
import ControlPanel from "../../components/games/digiarch/ControlPanel";
import PowerUpHUD from "../../components/games/digiarch/PowerUpHUD";
import CompletionScreen from "../../components/games/digiarch/CompletionScreen";
import AuthOverlay from "../../components/games/digiarch/AuthOverlay";
import SettingsOverlay from "../../components/games/digiarch/SettingsOverlay";

// Config & Data
import { LEVELS } from "../../components/games/digiarch/levels";
import "./DigiArch.css";

const DigiArch = () => {
  const { themeColor } = useTheme();
  const { user, submitScore, getAIHint } = useArcade();

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Game Progress
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userStyles, setUserStyles] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [result, setResult] = useState(null); // 'win' | 'fail' | null
  const [gameComplete, setGameComplete] = useState(false);
  const [stars, setStars] = useState([]); // stars per level

  // AI Hint states
  const [hintText, setHintText] = useState("");
  const [hintError, setHintError] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);

  // Session Time
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(100);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const level = LEVELS[currentLevel];

  // Initialize level controls
  useEffect(() => {
    const initial = {};
    level.controls.forEach((c) => {
      initial[c.property] = c.options[0];
    });
    setUserStyles(initial);
    setAttempts(0);
    setResult(null);
    setHintText("");
    setHintError("");
  }, [currentLevel]);

  // Set start time on mount / first interaction
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  // Submit score when game completes & user becomes logged in
  useEffect(() => {
    if (gameComplete && user && !scoreSubmitted) {
      const totalStars = stars.reduce((a, b) => a + (b || 0), 0);
      submitScore("digiarch", finalScore, totalStars, finalAccuracy, totalTime)
        .then((res) => {
          if (res.success) {
            setScoreSubmitted(true);
          }
        });
    }
  }, [gameComplete, user, finalScore, finalAccuracy, totalTime, scoreSubmitted, stars, submitScore]);

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

    // Check secondary constraints
    for (const key of Object.keys(target)) {
      if (key === "display") continue;
      if (
        !level.controls.find((c) => c.property === key) &&
        userStyles[key] !== target[key]
      ) {
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
      const earnedStars = attempts === 0 ? 3 : attempts < 3 ? 2 : 1;
      setStars((prev) => {
        const next = [...prev];
        next[currentLevel] = earnedStars;
        return next;
      });
    } else {
      setResult("fail");
      setAttempts((a) => a + 1);
      setTotalAttempts((t) => t + 1);
      
      // Auto-fallback local hint if attempts grow too large
      if (attempts >= 2 && !hintText) {
        setHintText(level.hint);
      }
      
      setTimeout(() => setResult(null), 1200);
    }
  }, [userStyles, level, attempts, currentLevel, hintText]);

  const advanceLevel = () => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel((l) => l + 1);
    } else {
      // Calculate final stats
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const totalStars = stars.reduce((a, b) => a + (b || 0), 0);
      const calculatedScore = Math.max(0, (totalStars * 1000) - (totalAttempts * 100) - (timeSpent * 2));
      const calculatedAccuracy = (LEVELS.length / (LEVELS.length + totalAttempts)) * 100;

      setTotalTime(timeSpent);
      setFinalScore(calculatedScore);
      setFinalAccuracy(calculatedAccuracy);
      setGameComplete(true);

      // Trigger initial submit attempt
      if (user) {
        submitScore("digiarch", calculatedScore, totalStars, calculatedAccuracy, timeSpent)
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
      gameId: "digiarch",
      levelId: level.id,
      levelTitle: level.title,
      instruction: level.instruction,
      currentStyles: userStyles,
      targetStyles: level.targetStyle,
      attempts: attempts,
    });

    setLoadingHint(false);
    if (res.success) {
      setHintText(res.hint);
    } else {
      setHintError(res.reason);
    }
  };

  const resetGame = () => {
    setCurrentLevel(0);
    setStars([]);
    setTotalAttempts(0);
    setGameComplete(false);
    setScoreSubmitted(false);
    setStartTime(Date.now());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="digiarch-page container mx-auto px-6 py-10 md:py-20 min-h-screen rounded-[32px] md:rounded-[60px] glass-theme"
      style={{ marginTop: "200px" }}
    >
      <div className="digiarch-scanlines" />

      {/* Overlays */}
      <AuthOverlay isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <SettingsOverlay isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {gameComplete ? (
        <CompletionScreen
          stars={stars}
          attempts={totalAttempts}
          totalScore={finalScore}
          totalTime={totalTime}
          onReset={resetGame}
        />
      ) : (
        <>
          <DigiArchHeader
            currentLevelIndex={currentLevel}
            totalLevels={LEVELS.length}
            levels={LEVELS}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

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

          <DigiArchStage
            level={level}
            userStyles={userStyles}
            result={result}
          />

          {/* Controls HUD */}
          <div className="max-w-2xl mx-auto relative z-10">
            <ControlPanel
              level={level}
              userStyles={userStyles}
              onControlChange={handleControlChange}
            />

            <PowerUpHUD
              attempts={attempts}
              onGetHint={handleGetHint}
              hintText={hintText}
              loadingHint={loadingHint}
              hintError={hintError}
            />

            {/* Action Submit */}
            <div className="flex gap-4">
              <button
                onClick={checkSolution}
                disabled={result === "win"}
                className="digiarch-submit-btn flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all font-comfortaa"
                style={{
                  backgroundColor:
                    result === "win" ? "#39ff14" : "var(--theme-color)",
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
                    <Zap size={18} /> Submit Layout
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

export default DigiArch;
