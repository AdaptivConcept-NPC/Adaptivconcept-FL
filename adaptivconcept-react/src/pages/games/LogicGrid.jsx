import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useArcade } from "../../context/ArcadeContext";

// Local Subcomponents
import GameHeader from "../../components/games/GameHeader";
import LogicGridMatrix from "../../components/games/logicgrid/LogicGridMatrix";
import CluesPanel from "../../components/games/logicgrid/CluesPanel";

// Reusable Shared components from digiarch
import PowerUpHUD from "../../components/games/digiarch/PowerUpHUD";
import CompletionScreen from "../../components/games/digiarch/CompletionScreen";
import AuthOverlay from "../../components/games/digiarch/AuthOverlay";
import SettingsOverlay from "../../components/games/digiarch/SettingsOverlay";

// Config & CSS
import { LEVELS } from "../../components/games/logicgrid/levels";
import "./LogicGrid.css";

const LogicGrid = () => {
  const { themeColor } = useTheme();
  const { user, submitScore, getAIHint } = useArcade();

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Level Progression
  const [currentLevel, setCurrentLevel] = useState(0);
  const [grid, setGrid] = useState([]);
  const [completedClues, setCompletedClues] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [result, setResult] = useState(null); // 'win' | 'fail' | null
  const [gameComplete, setGameComplete] = useState(false);
  const [stars, setStars] = useState([]); // stars per level

  // AI Hint states
  const [hintText, setHintText] = useState("");
  const [hintError, setHintError] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);

  // Timer & Scores
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(100);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const level = LEVELS[currentLevel];

  // Helper to determine if a cell at (r, c) should be checked in the correct solution
  const isSolutionCheck = useCallback((r, c) => {
    const { N, categories, solutions } = level;

    // Subgrid 1: Developer vs Language
    if (r < N && c < N) {
      const dev = categories.A.items[r];
      const lang = categories.B.items[c];
      return solutions[dev]?.B === lang;
    }
    // Subgrid 2: Developer vs Coffee/OS
    else if (r < N && c >= N) {
      const dev = categories.A.items[r];
      const categoryCItem = categories.C.items[c - N];
      return solutions[dev]?.C === categoryCItem;
    }
    // Subgrid 3: Coffee/OS vs Language
    else if (r >= N && c < N) {
      const categoryCItem = categories.C.items[r - N];
      const lang = categories.B.items[c];
      // Check if there is some developer who has BOTH this category C item and this language
      return Object.values(solutions).some(
        (sol) => sol.B === lang && sol.C === categoryCItem
      );
    }
    return false;
  }, [level]);

  // Helper to identify subgrid boundaries for auto-filling crosses
  const getSubgridBounds = (r, c, N) => {
    if (r < N && c < N) {
      return { rStart: 0, rEnd: N, cStart: 0, cEnd: N };
    } else if (r < N && c >= N) {
      return { rStart: 0, rEnd: N, cStart: N, cEnd: 2 * N };
    } else if (r >= N && c < N) {
      return { rStart: N, rEnd: 2 * N, cStart: 0, cEnd: N };
    }
    return null;
  };

  // Initialize Matrix
  useEffect(() => {
    const size = level.N * 2;
    const initialGrid = Array(size)
      .fill(null)
      .map(() => Array(size).fill("empty"));
    setGrid(initialGrid);
    setCompletedClues([]);
    setAttempts(0);
    setResult(null);
    setHintText("");
    setHintError("");
  }, [currentLevel, level]);

  // Record game start time
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  // Sync profile high score when user logs in mid-completion
  useEffect(() => {
    if (gameComplete && user && !scoreSubmitted) {
      const totalStars = stars.reduce((a, b) => a + (b || 0), 0);
      submitScore("logicgrid", finalScore, totalStars, finalAccuracy, totalTime)
        .then((res) => {
          if (res.success) setScoreSubmitted(true);
        });
    }
  }, [gameComplete, user, finalScore, finalAccuracy, totalTime, scoreSubmitted, stars, submitScore]);

  // Toggle grid state: empty -> cross -> check -> empty
  const handleToggleCell = useCallback((r, c) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);
      const current = newGrid[r][c];

      let nextState = "empty";
      if (current === "empty") nextState = "cross";
      else if (current === "cross") nextState = "check";

      newGrid[r][c] = nextState;

      // Smart Assist: If we check a box, auto-fill crosses in its row & column within that subgrid
      if (nextState === "check") {
        const bounds = getSubgridBounds(r, c, level.N);
        if (bounds) {
          const { rStart, rEnd, cStart, cEnd } = bounds;
          for (let i = rStart; i < rEnd; i++) {
            for (let j = cStart; j < cEnd; j++) {
              if (i === r && j === c) continue;
              if (i === r || j === c) {
                if (newGrid[i][j] === "empty") {
                  newGrid[i][j] = "cross";
                }
              }
            }
          }
        }
      }

      return newGrid;
    });
    setResult(null);
  }, [level.N]);

  const handleToggleClue = useCallback((idx) => {
    setCompletedClues((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  }, []);

  // Validate the player's checks against the solution
  const checkSolution = useCallback(() => {
    const { N } = level;
    let correct = true;

    // Check all active subgrids
    for (let r = 0; r < 2 * N; r++) {
      for (let c = 0; c < 2 * N; c++) {
        // Skip disabled bottom-right subgrid
        if (r >= N && c >= N) continue;

        const isCorrect = isSolutionCheck(r, c);
        const cell = grid[r]?.[c] || "empty";

        if (isCorrect && cell !== "check") {
          correct = false;
          break;
        }
        if (!isCorrect && cell === "check") {
          correct = false;
          break;
        }
      }
      if (!correct) break;
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

      if (attempts >= 2 && !hintText) {
        setHintText(level.hint);
      }

      setTimeout(() => setResult(null), 1200);
    }
  }, [grid, level, attempts, currentLevel, hintText, isSolutionCheck]);

  const advanceLevel = () => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel((l) => l + 1);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const totalStars = stars.reduce((a, b) => a + (b || 0), 0);
      const calculatedScore = Math.max(
        0,
        totalStars * 1000 - totalAttempts * 150 - timeSpent * 1.5
      );
      const calculatedAccuracy = (LEVELS.length / (LEVELS.length + totalAttempts)) * 100;

      setTotalTime(timeSpent);
      setFinalScore(calculatedScore);
      setFinalAccuracy(calculatedAccuracy);
      setGameComplete(true);

      if (user) {
        submitScore("logicgrid", calculatedScore, totalStars, calculatedAccuracy, timeSpent)
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

    // Build current grid dictionary representation to send to AI
    const currentMatches = {};
    const { N, categories } = level;
    const colItems = [...categories.B.items, ...categories.C.items];
    const rowItems = [...categories.A.items, ...categories.C.items];

    for (let r = 0; r < 2 * N; r++) {
      for (let c = 0; c < 2 * N; c++) {
        if (r >= N && c >= N) continue;
        if (grid[r]?.[c] === "check") {
          const rowName = rowItems[r];
          const colName = colItems[c];
          if (!currentMatches[rowName]) currentMatches[rowName] = [];
          currentMatches[rowName].push(colName);
        }
      }
    }

    const res = await getAIHint({
      gameId: "logicgrid",
      levelId: level.id,
      levelTitle: level.title,
      instruction: level.clues.map((c, i) => `${i + 1}. ${c}`).join("\n"),
      currentStyles: currentMatches,
      targetStyles: level.solutions,
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
      className="logicgrid-page container mx-auto px-6 py-10 md:py-20 min-h-screen rounded-[32px] md:rounded-[60px] glass-theme"
      style={{ marginTop: "200px" }}
    >
      <div className="logicgrid-scanlines" />

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
          <GameHeader
            title="LogicGrid Solver Console"
            emoji="🧠"
            themeColor="#00f2ff"
            currentLevelIndex={currentLevel}
            levels={LEVELS}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Level Title & Instruction */}
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-3xl md:text-5xl font-comfortaa font-bold text-high mb-3">
              <span className="logicgrid-glitch" data-text={level.title}>
                {level.title}
              </span>
            </h1>
            <p className="text-low text-sm md:text-base max-w-xl mx-auto font-poppins">
              {level.instruction}
            </p>
          </div>

          {/* Grid Layout & Clues Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 relative z-10 items-start">
            {/* Clues Panel (Left side on big screens) */}
            <div className="lg:col-span-5">
              <CluesPanel
                clues={level.clues}
                completedClues={completedClues}
                onToggleClue={handleToggleClue}
              />

              <PowerUpHUD
                attempts={attempts}
                onGetHint={handleGetHint}
                hintText={hintText}
                loadingHint={loadingHint}
                hintError={hintError}
              />
            </div>

            {/* Matrix (Right side on big screens) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-3 self-start pl-4">
                <div className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
                <span className="text-xs font-bold text-low tracking-widest uppercase font-mono">
                  MATRIX PUZZLE GRID
                </span>
              </div>

              <LogicGridMatrix
                level={level}
                grid={grid}
                onToggleCell={handleToggleCell}
              />
            </div>
          </div>

          {/* Submit controls */}
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="flex gap-4">
              <button
                onClick={checkSolution}
                disabled={result === "win"}
                className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all font-comfortaa border border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                style={{
                  backgroundColor:
                    result === "win"
                      ? "#39ff14"
                      : "rgba(0, 242, 255, 0.2)",
                  color: result === "win" ? "#000" : "#00f2ff",
                  borderColor: result === "win" ? "#39ff14" : "rgba(0, 242, 255, 0.4)",
                }}
              >
                {result === "win" ? (
                  <>
                    <Check size={20} /> Solution Verified!
                  </>
                ) : result === "fail" ? (
                  <>
                    <X size={20} /> Contradiction Detected
                  </>
                ) : (
                  <>
                    <Zap size={18} /> Submit Solution
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

            {/* Attempts Info */}
            <div className="text-center mt-4">
              <span className="text-xs font-mono text-low">
                Sub-optimal verification attempts: {attempts}
              </span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default LogicGrid;
