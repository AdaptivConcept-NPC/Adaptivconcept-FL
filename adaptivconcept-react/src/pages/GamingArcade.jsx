import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Gamepad2,
  Brain,
  Palette,
  Puzzle,
  ChevronRight,
  Sparkles,
  Zap,
  Code2,
  Boxes,
  Layers,
  Target,
  Lightbulb,
  Wand2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ArcadeAnim from "../components/ArcadeAnim";
import "./GamingArcade.css";

const games = [
  // === FOR PROBLEM-SOLVERS ===
  {
    id: "digiarch",
    title: "Digital Architect",
    subtitle: "CSS Flexbox Puzzle",
    description:
      "Master CSS layout by arranging nodes to match target designs. Progressively harder levels test your flexbox intuition.",
    icon: Code2,
    category: "Problem-Solvers",
    categoryIcon: Puzzle,
    tags: ["CSS", "Flexbox", "Layout"],
    status: "playable",
    color: "#39ff14",
    route: "/arcade/digiarch",
  },
  {
    id: "logicgrid",
    title: "Logic Grid",
    subtitle: "Deduction Puzzler",
    description:
      "Solve constraint-based logic puzzles on a grid. Eliminate impossibilities and find the single valid solution.",
    icon: Brain,
    category: "Thinkers",
    categoryIcon: Lightbulb,
    tags: ["Logic", "Deduction", "Grid"],
    status: "coming-soon",
    color: "#00f2ff",
    route: null,
  },
  {
    id: "chromasync",
    title: "ChromaSync",
    subtitle: "Color Harmony Engine",
    description:
      "Match color palettes by mixing RGB channels under time pressure. Train your eye for design harmony.",
    icon: Palette,
    category: "Artists",
    categoryIcon: Wand2,
    tags: ["Color", "Design", "Timing"],
    status: "coming-soon",
    color: "#bc13fe",
    route: null,
  },
  // === FOR THINKERS ===
  {
    id: "patternforge",
    title: "PatternForge",
    subtitle: "Sequence Decoder",
    description:
      "Identify and extend complex number, shape, and symbol sequences before the clock runs out.",
    icon: Layers,
    category: "Thinkers",
    categoryIcon: Lightbulb,
    tags: ["Patterns", "Sequences", "IQ"],
    status: "coming-soon",
    color: "#fd3b12",
    route: null,
  },
  // === FOR ARTISTS ===
  {
    id: "pixelcanvas",
    title: "Pixel Canvas",
    subtitle: "Retro Art Studio",
    description:
      "Create pixel art masterpieces on a grid canvas with a retro-inspired palette. Export and share your creations.",
    icon: Boxes,
    category: "Artists",
    categoryIcon: Wand2,
    tags: ["Pixel Art", "Creative", "Retro"],
    status: "coming-soon",
    color: "#ff3366",
    route: null,
  },
  // === FOR PROBLEM-SOLVERS ===
  {
    id: "nodeflow",
    title: "NodeFlow",
    subtitle: "Graph Pathfinder",
    description:
      "Navigate data-flow graphs to connect source to sink. Learn graph traversal through visual puzzles.",
    icon: Target,
    category: "Problem-Solvers",
    categoryIcon: Puzzle,
    tags: ["Graphs", "Algorithms", "Pathfinding"],
    status: "coming-soon",
    color: "#00ff88",
    route: null,
  },
];

const categories = [
  { name: "All", icon: Sparkles },
  { name: "Problem-Solvers", icon: Puzzle },
  { name: "Thinkers", icon: Lightbulb },
  { name: "Artists", icon: Wand2 },
];

const GamingArcade = () => {
  const {
    themeColor,
    activeFontFamily,
    activeFontScale,
    isOverkillEnabled,
    setIsOverkillEnabled,
  } = useTheme();
  const [activeCategory, setActiveCategory] = React.useState("All");

  const filteredGames =
    activeCategory === "All"
      ? games
      : games.filter((g) => g.category === activeCategory);

  return (
    <ArcadeAnim
      className="arcade-page container mx-auto px-6 py-10 md:py-20 min-h-screen rounded-[32px] md:rounded-[60px] glass-theme"
      style={{ marginTop: "200px" }}
    >
      {/* Hero */}
      <div className="text-center mb-16 relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-6"
          style={{
            backgroundColor: "rgba(var(--theme-color-rgb), 0.15)",
            border: "1px solid rgba(var(--theme-color-rgb), 0.3)",
          }}
        >
          <Gamepad2 size={18} style={{ color: themeColor.washType === "coal" ? "#ffffff" : "var(--theme-color)" }} />
          <span
            className="text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: themeColor.washType === "coal" ? "#ffffff" : "var(--theme-color)" }}
          >
            Dev Arcade
          </span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-comfortaa font-bold text-high mb-4">
          <span className="arcade-glitch-text-continue" data-text="Game">
            Game
          </span>{" "}
          <span
            className="text-adaptiv-orange"
            style={{
              fontFamily: activeFontFamily,
              textShadow: "3px 3px 0px rgba(0,0,0,0.5)",
              // fontSize: `calc(3rem * ${activeFontScale})`,
              lineHeight: "1.1",
            }}
          >
            Dev Arcade
          </span>
        </h1>
        <p className="text-lg md:text-xl text-low font-poppins max-w-2xl mx-auto">
          Browser-based games for{" "}
          <span className="arcade-type-label" style={{ color: "#00f2ff" }}>
            thinkers
          </span>
          ,{" "}
          <span className="arcade-type-label" style={{ color: "#bc13fe" }}>
            artists
          </span>
          , and{" "}
          <span className="arcade-type-label" style={{ color: "#39ff14" }}>
            problem-solvers
          </span>
          .
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-16 relative z-10">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`arcade-filter-btn px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? `bg-adaptiv-orange ${themeColor.washType === "coal" ? "text-black" : "text-white"} shadow-lg shadow-adaptiv-orange/20`
                  : "glass-theme text-low hover:text-high"
              }`}
            >
              <Icon size={16} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {filteredGames.map((game, idx) => {
          const GameIcon = game.icon;
          const CatIcon = game.categoryIcon;
          const isPlayable = game.status === "playable";

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              layout
            >
              <div
                className={`arcade-game-card group glass-theme glass-theme-hover rounded-2xl p-6 md:p-8 flex flex-col h-full transition-all relative overflow-hidden ${
                  !isPlayable ? "opacity-60 grayscale hover:grayscale-0" : ""
                }`}
                style={{ "--card-accent": game.color }}
              >
                {/* Corner accent glow */}
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full -mr-14 -mt-14 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: game.color }}
                />

                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div
                    className="p-3 rounded-2xl"
                    style={{
                      backgroundColor: `${game.color}20`,
                      color: game.color,
                    }}
                  >
                    <GameIcon size={24} />
                  </div>
                  <div className="flex items-center gap-2">
                    <CatIcon size={12} className="text-low" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-low">
                      {game.category}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3
                  className={`text-2xl font-comfortaa font-bold text-high mb-1 transition-colors ${
                    themeColor.washType === "coal"
                      ? "group-hover:text-white"
                      : themeColor.washType === "light"
                        ? "group-hover:text-black"
                        : "group-hover:text-adaptiv-orange"
                  }`}
                >
                  {game.title}
                </h3>
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-4"
                  style={{ color: game.color }}
                >
                  {game.subtitle}
                </p>

                {/* Description */}
                <p className="text-low text-sm leading-relaxed mb-6 flex-grow">
                  {game.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-theme text-[11px] text-low font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Status Badge & CTA */}
                {isPlayable ? (
                  <Link
                    to={game.route}
                    className="arcade-play-btn w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                    style={{
                      backgroundColor: game.color,
                      color: "#000",
                      boxShadow: `0 4px 20px ${game.color}33`,
                    }}
                  >
                    <Zap size={18} />
                    Play Now
                    <ChevronRight size={16} />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-3.5 rounded-xl border border-white/10 text-low font-bold cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    Coming Soon
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-20 relative z-10"
      >
        <p className="text-low text-sm font-poppins">
          More games are being forged in the lab.{" "}
          <span style={{ color: "var(--theme-color)" }}>Stay tuned.</span>
        </p>
      </motion.div>
    </ArcadeAnim>
  );
};

export default GamingArcade;
