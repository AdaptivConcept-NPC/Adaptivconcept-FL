import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, ChevronRight, RefreshCw, Layers } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useArcade } from "../context/ArcadeContext";

// Local Subcomponents & levels
import NodeFlowHeader from "../components/games/nodeflow/NodeFlowHeader";
import { LEVELS } from "../components/games/nodeflow/levels";
import "./NodeFlow.css";

// Reusable Shared Overlays
import PowerUpHUD from "../components/games/digiarch/PowerUpHUD";
import CompletionScreen from "../components/games/digiarch/CompletionScreen";
import AuthOverlay from "../components/games/digiarch/AuthOverlay";
import SettingsOverlay from "../components/games/digiarch/SettingsOverlay";

const NodeFlow = () => {
  const { themeColor } = useTheme();
  const { user, submitScore, getAIHint } = useArcade();

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Level States
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedPath, setSelectedPath] = useState(["S"]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState(null); // 'win' | 'fail' | null
  const [gameComplete, setGameComplete] = useState(false);
  const [stars, setStars] = useState([]); // stars per level
  const [shakingNode, setShakingNode] = useState(null);

  // Log feed
  const [logs, setLogs] = useState([{ text: "Initializing NodeFlow Routing Deck...", type: "sys" }]);
  const terminalEndRef = useRef(null);

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

  // Auto-scroll terminal logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Add line to terminal
  const addLog = (text, type = "info") => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    setLogs((prev) => [...prev, { text: `[${timestamp}] ${text}`, type }]);
  };

  // Initialize level
  useEffect(() => {
    setTimeLeft(45);
    setSelectedPath(["S"]);
    setResult(null);
    setHintText("");
    setHintError("");
    setAttempts(0);
    setShakingNode(null);
    setLogs([
      { text: `SYSTEM: Loaded level ${level.id} - ${level.title}`, type: "sys" },
      { text: `ROUTER: Packet stream routing source S -> sink T. Constraint: ${level.instruction}`, type: "info" }
    ]);
  }, [currentLevel, level]);

  // Countdown timer clock tick
  useEffect(() => {
    if (gameComplete || result === "win" || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setResult("fail");
          addLog("ROUTING CLOCK EXPIRED: Packets dropped. Path timed out.", "err");
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
      submitScore("nodeflow", finalScore, totalStars, finalAccuracy, 135 - totalTimeRemaining)
        .then((res) => {
          if (res.success) setScoreSubmitted(true);
        });
    }
  }, [gameComplete, user, finalScore, finalAccuracy, totalTimeRemaining, scoreSubmitted, stars, submitScore]);

  // Helper to compute selected path details
  const getSelectedPathCost = () => {
    let cost = 0;
    for (let i = 0; i < selectedPath.length - 1; i++) {
      const edge = level.edges.find(
        (e) => e.from === selectedPath[i] && e.to === selectedPath[i + 1]
      );
      if (edge) cost += edge.weight || 0;
    }
    return cost;
  };

  const getSelectedPathBottleneck = () => {
    let minCapacity = Infinity;
    for (let i = 0; i < selectedPath.length - 1; i++) {
      const edge = level.edges.find(
        (e) => e.from === selectedPath[i] && e.to === selectedPath[i + 1]
      );
      if (edge && edge.weight !== undefined) {
        minCapacity = Math.min(minCapacity, edge.weight);
      }
    }
    return minCapacity === Infinity ? 0 : minCapacity;
  };

  // Node Clicking Traversal Logic
  const handleNodeClick = (nodeId) => {
    if (result === "win" || timeLeft <= 0) return;

    // 1. Backtrack validation: if clicking the second-to-last node, pop the last node
    if (selectedPath.length > 1 && selectedPath[selectedPath.length - 2] === nodeId) {
      const popped = selectedPath[selectedPath.length - 1];
      setSelectedPath((prev) => prev.slice(0, -1));
      addLog(`Traversing back. Removed node ${popped} from routing path.`, "info");
      return;
    }

    // 2. Prevent duplicate node selection (except backtracking)
    if (selectedPath.includes(nodeId)) {
      setShakingNode(nodeId);
      setTimeout(() => setShakingNode(null), 400);
      addLog(`ROUTING ERROR: Node ${nodeId} already visited. back-propagate to edit.`, "err");
      return;
    }

    const lastNode = selectedPath[selectedPath.length - 1];

    // 3. Verify directed edge existence
    const validEdge = level.edges.find((e) => e.from === lastNode && e.to === nodeId);
    if (!validEdge) {
      setShakingNode(nodeId);
      setTimeLeft((t) => Math.max(0, t - 3)); // Deduct 3 seconds penalty
      setTimeout(() => setShakingNode(null), 400);
      addLog(`LINK FAILED: No direct channel from ${lastNode} to ${nodeId}. Penalty applied.`, "err");
      return;
    }

    // 4. Mode-specific step assertions
    if (level.type === "bfs_traversal") {
      const expectedNext = level.target[selectedPath.length];
      if (nodeId !== expectedNext) {
        setShakingNode(nodeId);
        setAttempts((a) => a + 1);
        setTimeLeft((t) => Math.max(0, t - 5)); // 5s penalty for BFS queue violation
        setTimeout(() => setShakingNode(null), 400);
        addLog(`QUEUE MISALIGNMENT: Node ${nodeId} is not in correct BFS traversal order. Expected: ${expectedNext}.`, "err");
        return;
      }
    }

    // Append to path
    const nextPath = [...selectedPath, nodeId];
    setSelectedPath(nextPath);
    addLog(`LINK CONNECTED: Signal established at router node ${nodeId}.`, "info");

    // 5. Check if Sink (T) has been reached
    if (nodeId === "T") {
      evaluateCompletePath(nextPath);
    }
  };

  const evaluateCompletePath = (path) => {
    let isCorrect = false;

    if (level.type === "shortest_path") {
      let cost = 0;
      for (let i = 0; i < path.length - 1; i++) {
        const edge = level.edges.find((e) => e.from === path[i] && e.to === path[i + 1]);
        if (edge) cost += edge.weight || 0;
      }
      isCorrect = cost === level.targetCost;
      if (isCorrect) {
        addLog(`SUCCESS: Target Sink reached at optimal cost [${cost}].`, "sys");
      } else {
        addLog(`ROUTING CRITERIA FAIL: S->T path cost [${cost}] exceeds optimal Dijkstra cost [${level.targetCost}].`, "err");
      }
    } else if (level.type === "bfs_traversal") {
      isCorrect = path.join(",") === level.target.join(",");
      if (isCorrect) {
        addLog("SUCCESS: Full BFS traversal path verified successfully.", "sys");
      }
    } else if (level.type === "max_flow_path") {
      let minCap = Infinity;
      for (let i = 0; i < path.length - 1; i++) {
        const edge = level.edges.find((e) => e.from === path[i] && e.to === path[i + 1]);
        if (edge) minCap = Math.min(minCap, edge.weight || 0);
      }
      isCorrect = minCap === level.targetCapacity;
      if (isCorrect) {
        addLog(`SUCCESS: Route established with maximal bottleneck capacity [${minCap}].`, "sys");
      } else {
        addLog(`ROUTING CRITERIA FAIL: Flow bottleneck [${minCap}] is sub-optimal. Maximize link capacity.`, "err");
      }
    }

    if (isCorrect) {
      setResult("win");
      const earnedStars = timeLeft > 30 ? 3 : timeLeft > 15 ? 2 : 1;
      setStars((prev) => {
        const next = [...prev];
        next[currentLevel] = earnedStars;
        return next;
      });
    } else {
      setAttempts((a) => a + 1);
      // Shake final node to indicate path failure
      setShakingNode("T");
      setTimeout(() => setShakingNode(null), 400);
    }
  };

  const advanceLevel = () => {
    setTotalTimeRemaining((prev) => prev + timeLeft);

    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel((l) => l + 1);
    } else {
      // Calculate overall stats
      const finalAccumTime = totalTimeRemaining + timeLeft;
      const totalStars = stars.reduce((a, b) => a + (b || 0), 0);
      const calculatedScore = totalStars * 1000 + finalAccumTime * 10;
      const calculatedAccuracy = parseFloat((((LEVELS.length) / (LEVELS.length + attempts)) * 100).toFixed(1));

      setFinalScore(calculatedScore);
      setFinalAccuracy(calculatedAccuracy);
      setGameComplete(true);

      if (user) {
        submitScore("nodeflow", calculatedScore, totalStars, calculatedAccuracy, 135 - finalAccumTime)
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
      gameId: "nodeflow",
      levelId: level.id,
      levelTitle: level.title,
      instruction: level.instruction,
      currentStyles: { path: selectedPath, attempts },
      targetStyles: level.edges,
      attempts: attempts,
    });

    setLoadingHint(false);
    if (res.success) {
      setHintText(res.hint);
    } else {
      setHintError(res.reason);
    }
  };

  const handleResetLevel = () => {
    setSelectedPath(["S"]);
    setResult(null);
    setShakingNode(null);
    addLog("ROUTER: Purged path matrix buffer. Starting routing from S.", "info");
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
      className="nodeflow-page container mx-auto px-6 py-10 md:py-20 min-h-screen rounded-[32px] md:rounded-[60px] glass-theme"
      style={{ marginTop: "200px" }}
    >
      <div className="nodeflow-scanlines" />

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
          <NodeFlowHeader
            currentLevelIndex={currentLevel}
            totalLevels={LEVELS.length}
            levels={LEVELS}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Level Header Info */}
          <div className="text-center mb-6 relative z-10 flex flex-col items-center">
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
              ⏳ NETWORK STABILIZATION TIME: {timeLeft}s
            </div>
          </div>

          {/* Graph Sandbox & Terminal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8 relative z-10">
            {/* SVG Graph View (Takes 2 Cols) */}
            <div className="lg:col-span-2 p-6 rounded-2xl glass-theme border border-white/10 flex flex-col items-center justify-center min-h-[380px] relative select-none">
              <svg className="w-full h-[320px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* SVG Arrow Marker definitions */}
                <defs>
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="23"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#525252" />
                  </marker>
                  <marker
                    id="arrow-active"
                    viewBox="0 0 10 10"
                    refX="23"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#00ff88" />
                  </marker>
                </defs>

                {/* Draw Edges */}
                {level.edges.map((edge, idx) => {
                  const fromNode = level.nodes.find((n) => n.id === edge.from);
                  const toNode = level.nodes.find((n) => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  // Check if this specific edge is part of the player's path sequence
                  let isActive = false;
                  for (let i = 0; i < selectedPath.length - 1; i++) {
                    if (selectedPath[i] === edge.from && selectedPath[i + 1] === edge.to) {
                      isActive = true;
                      break;
                    }
                  }

                  const x1 = fromNode.x;
                  const y1 = fromNode.y;
                  const x2 = toNode.x;
                  const y2 = toNode.y;

                  // Edge Label Coordinates (Midpoint)
                  const mx = (x1 + x2) / 2;
                  const my = (y1 + y2) / 2 - 2;

                  return (
                    <g key={`edge-${idx}`}>
                      {/* Base link line */}
                      <line
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke={isActive ? "#00ff88" : "rgba(255, 255, 255, 0.12)"}
                        strokeWidth={isActive ? "4" : "2"}
                        markerEnd={`url(#${isActive ? "arrow-active" : "arrow"})`}
                        className={`nodeflow-edge ${isActive ? "nodeflow-edge-active" : ""}`}
                      />
                      {/* Flow Signal Particle Overlay */}
                      {isActive && (
                        <line
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke="#00ff88"
                          strokeWidth="2.5"
                          className="nodeflow-particle"
                        />
                      )}
                      {/* Edge weight badge if available */}
                      {edge.weight !== undefined && (
                        <g>
                          <rect
                            x={`${mx}%`}
                            y={`${my}%`}
                            width="6%"
                            height="4%"
                            transform="translate(-10, -5)"
                            fill="#171717"
                            stroke={isActive ? "#00ff88" : "rgba(255, 255, 255, 0.1)"}
                            strokeWidth="1"
                            rx="4"
                          />
                          <text
                            x={`${mx}%`}
                            y={`${my}%`}
                            transform="translate(-1, 0)"
                            fill={isActive ? "#00ff88" : "#a3a3a3"}
                            fontSize="3"
                            fontFamily="monospace"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {edge.weight}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Draw Nodes */}
                {level.nodes.map((node) => {
                  const isVisited = selectedPath.includes(node.id);
                  const isCurrent = selectedPath[selectedPath.length - 1] === node.id;
                  const isSource = node.type === "source";
                  const isSink = node.type === "sink";
                  const isShaking = shakingNode === node.id;

                  // Compute border color
                  let strokeColor = "rgba(255, 255, 255, 0.2)";
                  if (isCurrent) strokeColor = "#00ff88";
                  else if (isVisited) strokeColor = "rgba(0, 255, 136, 0.4)";
                  else if (isSource) strokeColor = "#38bdf8";
                  else if (isSink) strokeColor = "#fbbf24";

                  // Node background fill
                  let fillColor = "rgba(23, 23, 23, 0.9)";
                  if (isCurrent) fillColor = "rgba(0, 255, 136, 0.1)";

                  return (
                    <g
                      key={node.id}
                      onClick={() => handleNodeClick(node.id)}
                      className={isShaking ? "node-shake" : ""}
                    >
                      {/* Outer Glow filter for current node */}
                      {isCurrent && (
                        <circle
                          cx={`${node.x}%`}
                          cy={`${node.y}%`}
                          r="6.5"
                          fill="none"
                          stroke="#00ff88"
                          strokeWidth="1.5"
                          className="animate-ping"
                          style={{ animationDuration: "2s" }}
                        />
                      )}
                      <circle
                        cx={`${node.x}%`}
                        cy={`${node.y}%`}
                        r="5.5"
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isCurrent ? "2.5" : "1.5"}
                        className="nodeflow-node-circle"
                      />
                      {/* Node Text Label */}
                      <text
                        x={`${node.x}%`}
                        y={`${node.y}%`}
                        dy="1.2"
                        textAnchor="middle"
                        fill={isCurrent ? "#00ff88" : "#ffffff"}
                        fontSize="4"
                        fontFamily="monospace"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Right side status column */}
            <div className="flex flex-col gap-4">
              {/* Path Stats HUD */}
              <div className="p-5 rounded-2xl glass-theme border border-white/10 flex-1 flex flex-col justify-between font-mono">
                <div>
                  <h3 className="text-xs font-bold text-[#00ff88] uppercase tracking-wider mb-3">
                    🛰️ TRAVERSAL STATUS
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Current Node:</span>
                      <span className="text-white font-bold">{selectedPath[selectedPath.length - 1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Visited Nodes:</span>
                      <span className="text-white font-bold">{selectedPath.length}</span>
                    </div>
                    {level.type === "shortest_path" && (
                      <div className="flex justify-between border-t border-white/5 pt-2">
                        <span className="text-neutral-400">Accrued Cost:</span>
                        <span className="text-emerald-400 font-bold">
                          {getSelectedPathCost()} <span className="text-[10px] text-neutral-500">/ max optimal: {level.targetCost}</span>
                        </span>
                      </div>
                    )}
                    {level.type === "max_flow_path" && (
                      <div className="flex justify-between border-t border-white/5 pt-2">
                        <span className="text-neutral-400">Flow Capacity:</span>
                        <span className="text-emerald-400 font-bold">
                          {getSelectedPathBottleneck()} <span className="text-[10px] text-neutral-500">/ optimal: {level.targetCapacity}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                  <span className="text-[10px] text-neutral-500 block mb-1">ROUTING ARRAY:</span>
                  <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 text-xs text-white overflow-x-auto whitespace-nowrap text-center">
                    {selectedPath.join(" → ")}
                  </div>
                </div>
              </div>

              {/* Autoscrolling Terminal logs console */}
              <div className="nodeflow-terminal flex-1 flex flex-col justify-between">
                <div className="overflow-y-auto pr-1">
                  {logs.map((log, i) => (
                    <div key={i} className={`nodeflow-terminal-line ${log.type}`}>
                      {log.text}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              </div>
            </div>
          </div>

          {/* Action bar and submit overlays */}
          <div className="max-w-2xl mx-auto relative z-10 flex flex-col gap-6">
            <div className="flex gap-4">
              <button
                onClick={handleResetLevel}
                className="p-4 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-all"
                title="Purge routing path"
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
                    <Check size={20} /> Packets Transmitted successfully! Route optimal.
                  </>
                ) : (
                  <>
                    <Layers size={18} className="text-[#00ff88]" /> Routing Packets...
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
                  {currentLevel < LEVELS.length - 1 ? "Next Route" : "Finish"}
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

export default NodeFlow;
