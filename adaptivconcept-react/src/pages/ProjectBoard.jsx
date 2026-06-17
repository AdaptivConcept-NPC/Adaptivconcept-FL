import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Rocket,
  Terminal,
  Cpu,
  ChevronRight,
  Sparkles,
  Zap,
  Calendar,
  Hash,
  Link2,
  Send,
  FileText,
  PlusCircle,
} from "lucide-react";
import BrandIcon from "../components/BrandIcon";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import projectsDataLocal from "../data/projects.json";
import routeMap from "../data/route_map.json";
import { getProjects } from "../utils/dataStore";

const ProjectBoard = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectsData, setProjectsData] = useState(projectsDataLocal);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const {
    themeColor,
    activeFontFamily,
    activeFontScale,
    isOverkillEnabled,
    setIsOverkillEnabled,
  } = useTheme();

  useEffect(() => {
    getProjects().then(setProjectsData);
  }, []);

  const categories = [
    "All",
    "Automation",
    "Game Dev",
    "Frontend",
    "Backend",
    "Fullstack",
    "AdaptivConcept™",
  ];

  const filteredProjects = projectsData.filter((project) => {
    const matchesCategory =
      activeCategory === "All" || project.category === activeCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  const labCards = [
    {
      id: "pyswissshef",
      title: "PySwissShef Lab",
      description:
        "Interactive Python & Shell catalogue hosted on StackBlitz. Test automation recipes instantly.",
      logo: "/media/pyswissshef_logo.png",
      icon: <Rocket size={24} />,
      status: "Scripting Lab",
      statusColor: "adaptiv-orange",
      glowColor: "bg-adaptiv-orange/10",
      hoverGradient: "linear-gradient(135deg, rgba(255, 145, 0, 0.15) 0%, transparent 60%)",
      themeColor: "adaptiv-orange",
      path: "/labs/pyswissshef",
      shadowColor: "shadow-adaptiv-orange/20",
      brands: [
        "python",
        "javascript",
        "vite",
        "fastapi",
        "django",
        "stackblitz",
        "replit",
        "github",
      ],
    },
    {
      id: "aicodex",
      title: "AICodex Lab",
      description:
        "Advanced agentic orchestration and real-time reasoning portal. Connected to LPU-speed inference.",
      logo: "/media/spirit_bird_aicodex_half.png",
      icon: <Cpu size={24} />,
      status: "Agentic Lab",
      statusColor: "purple",
      glowColor: "bg-purple-500/10",
      hoverGradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, transparent 60%)",
      themeColor: "purple-500",
      path: "/labs/aicodex",
      shadowColor: "shadow-purple-500/20",
      brands: [
        "react",
        "groq",
        "langgraph",
        "gemini",
        "openrouter",
        "ollama",
        "fastapi",
        "typescript",
        "apiapp",
        "github",
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 py-10 md:py-20 min-h-screen rounded-[32px] md:rounded-[60px] glass-theme"
      style={{ marginTop: "200px", opacity: 1 }}
    >
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-comfortaa font-bold text-high mb-6">
          Project{" "}
          <span
            className="text-adaptiv-orange"
            style={{
              fontFamily: activeFontFamily,
              textShadow: "3px 3px 0px rgba(0,0,0,0.5)",
              // fontSize: `calc(3rem * ${activeFontScale})`,
              lineHeight: "1.1",
            }}
          >
            Board
          </span>
        </h1>
        <p className="text-lg md:text-xl text-low font-poppins max-w-2xl mx-auto">
          A segmented showcase of technical explorations, business solutions,
          and research.
        </p>
      </div>

      {/* Dev Labs Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
            <h2 className="text-3xl font-comfortaa font-bold text-high flex items-center gap-3">
              <Terminal className="text-adaptiv-orange" /> Dev{" "}
              <span className="text-adaptiv-orange">Labs</span>
            </h2>
            <p className="text-low text-sm mt-2">
              Interactive environments and experimental portals.
            </p>
          </div>
          <Link
            to="/tech-wall"
            className="text-xs font-bold hover:underline tracking-widest uppercase flex items-center gap-2"
            style={{ color: "var(--heading-color)" }}
          >
            View Stack <ChevronRight size={14} />
          </Link>
        </div>

        <div className="relative group/labs px-2">
          <motion.div className="flex gap-6 overflow-x-auto px-8 pt-4 pb-8 snap-x no-scrollbar cursor-grab active:cursor-grabbing">
            {labCards.map((lab) => (
              <motion.div
                key={lab.id}
                whileHover={{ y: -8 }}
                className="min-w-[300px] md:min-w-[400px] snap-start"
              >
                <div className="glass-theme rounded-[32px] p-8 h-full border border-white/5 relative overflow-hidden group transition-all duration-500 hover:border-adaptiv-orange/30 flex flex-col">
                  {/* Hover Gradient Overlay */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: lab.hoverGradient }}
                  />
                  
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 ${lab.glowColor} blur-3xl rounded-full -mr-10 -mt-10`}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-lg overflow-hidden"
                        style={{ 
                          backgroundColor: lab.themeColor === "adaptiv-orange" ? "rgba(255, 145, 0, 0.2)" : "rgba(168, 85, 247, 0.2)",
                          color: lab.themeColor === "adaptiv-orange" ? "var(--adaptiv-orange)" : "#a855f7" 
                        }}
                      >
                        {lab.logo ? (
                          <img src={lab.logo} alt={lab.title} className="w-full h-full object-cover" />
                        ) : (
                          lab.icon
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase border transition-all duration-300`}
                        style={{
                          backgroundColor: lab.statusColor === "green" ? "rgba(34, 197, 94, 0.2)" : "rgba(247, 177, 85, 0.2)",
                          color: lab.statusColor === "green" ? "#4ade80" : "#f7b155",
                          borderColor: lab.statusColor === "green" ? "rgba(34, 197, 94, 0.3)" : "rgba(168, 85, 247, 0.3)"
                        }}
                      >
                        {lab.status}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-high mb-2">
                      {lab.title}
                    </h3>
                    <p className="text-low text-sm leading-relaxed mb-6">
                      {lab.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mb-8">
                      {lab.brands.map((brand) => (
                        <BrandIcon key={brand} name={brand} size={18} />
                      ))}
                    </div>

                    <Link
                      to={lab.path}
                      className={`flex items-center justify-center gap-2 w-full py-3 mt-auto rounded-xl font-bold btn-adaptive-hover transition-all shadow-lg ${lab.shadowColor}`}
                      style={{
                        backgroundColor: "var(--theme-color)",
                        color: "contrast-color(var(--theme-color))",
                      }}
                    >
                      Enter Lab <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Collaborate Lab Card */}
            <motion.div
              whileHover={{ y: -8 }}
              className="min-w-[300px] md:min-w-[400px] snap-start"
            >
              <div className="glass-theme rounded-[32px] p-8 h-full border border-white/5 relative overflow-hidden group transition-all duration-500 hover:border-adaptiv-orange/30 flex flex-col">
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(255, 145, 0, 0.1) 0%, transparent 60%)" }}
                />
                <div className="absolute top-0 right-0 w-32 h-32 bg-adaptiv-orange/5 blur-3xl rounded-full -mr-10 -mt-10" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-adaptiv-orange/20 text-adaptiv-orange shadow-inner flex items-center justify-center">
                      <PlusCircle size={24} />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-low text-[10px] font-black tracking-tighter uppercase border border-white/10">
                      Open Mission
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-high mb-2">
                    Collaborate
                  </h3>
                  <p className="text-low text-sm leading-relaxed mb-6">
                    Have an architectural challenge or a high-octane idea? Let's
                    engineer it.
                  </p>

                  <AnimatePresence>
                    {!isFormOpen && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-white/10 text-low font-bold hover:text-high hover:border-adaptiv-orange/30 transition-all group/btn mb-4"
                      >
                        Define Project <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isFormOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden flex flex-col flex-grow"
                      >
                        {/* Scrollable Form Container */}
                        <div className="flex-grow overflow-y-auto max-h-[180px] no-scrollbar pr-2 mb-6 space-y-4">
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 text-low/50" size={16} />
                            <textarea
                              placeholder="Core Concept / Idea..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-high focus:border-adaptiv-orange/40 outline-none transition-all resize-none font-poppins"
                              rows="2"
                            />
                          </div>
                          <div className="relative">
                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-low/50" size={16} />
                            <input
                              type="url"
                              placeholder="Reference Links..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-high focus:border-adaptiv-orange/40 outline-none transition-all font-poppins"
                            />
                          </div>
                          <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-low/50" size={16} />
                            <input
                              type="text"
                              placeholder="Stack Tags (e.g. React, LLM)"
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-high focus:border-adaptiv-orange/40 outline-none transition-all font-poppins"
                            />
                          </div>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-low/50" size={16} />
                            <input
                              type="date"
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-high focus:border-adaptiv-orange/40 outline-none transition-all font-poppins"
                            />
                          </div>
                        </div>

                        <button
                          className="flex items-center justify-center gap-2 w-full py-3 mt-auto rounded-xl font-bold btn-adaptive-hover transition-all shadow-lg shadow-adaptiv-orange/20"
                          style={{
                            backgroundColor: "var(--theme-color)",
                            color: "contrast-color(var(--theme-color))",
                          }}
                        >
                          Deploy Request <Send size={18} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-5xl mx-auto mb-20">
        <div className="glass-theme rounded-[24px] md:rounded-[32px] p-3 md:p-4 flex flex-col lg:flex-row items-center gap-4 md:gap-6 shadow-2xl">
          <div className="w-full lg:flex-grow relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-low group-focus-within:text-adaptiv-orange transition-colors"
              size={20}
            />
            <input
              type="text"
              className="w-full border border-theme text-high pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:border-adaptiv-orange/40 transition-all font-poppins placeholder:text-low/60"
              placeholder="Search by tech stack or name..."
              style={{ backgroundColor: "var(--input-bg)" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? "shadow-lg shadow-adaptiv-orange/20"
                    : "glass-theme text-low hover:text-high transition-all"
                }`}
                style={
                  activeCategory === cat
                    ? {
                        backgroundColor: "var(--theme-color)",
                        color: "contrast-color(var(--theme-color))",
                      }
                    : {}
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Overkill Toggle */}
          <div className="flex items-center gap-3 pl-4 border-l border-theme/20 h-10 ml-auto">
            <button
              onClick={() => setIsOverkillEnabled(!isOverkillEnabled)}
              className={`p-2.5 rounded-xl flex items-center gap-2 transition-all ${
                isOverkillEnabled
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "glass-theme text-low hover:text-high"
              }`}
              title={
                isOverkillEnabled
                  ? "Experimental Fonts Active (Heavy)"
                  : "Load Experimental Fonts (17MB+)"
              }
            >
              {isOverkillEnabled ? <Sparkles size={18} /> : <Zap size={18} />}
              <span className="text-xs font-bold hidden sm:inline">
                {isOverkillEnabled ? "Experimental Active" : "Load XP Fonts"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="group glass-theme glass-theme-hover rounded-2xl p-6 md:p-8 flex flex-col h-full transition-all">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-adaptiv-orange">
                      {project.category === "Game Dev" && <Rocket size={20} />}
                      {project.category === "Automation" && (
                        <Terminal size={20} />
                      )}
                      {project.category === "Fullstack" && <Cpu size={20} />}
                    </div>
                    <span className="text-xs uppercase font-bold tracking-[0.2em] text-low">
                      {project.category}
                    </span>
                  </div>
                  {project.isHero && (
                    <span className={`px-3 py-1 rounded-full bg-adaptiv-orange text-[10px] font-black tracking-tighter ${themeColor.washType === "coal" ? "text-black" : "text-white"}`}>
                      FEATURED
                    </span>
                  )}
                </div>

                <h3
                  className={`text-2xl font-comfortaa font-bold text-high mb-3 transition-colors ${themeColor.washType === "coal" ? "group-hover:text-white" : themeColor.washType === "light" ? "group-hover:text-black" : "group-hover:text-adaptiv-orange"}`}
                >
                  {project.title}
                </h3>
                <p className="text-low text-sm leading-relaxed mb-8 flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-theme text-[11px] text-low font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/projects/${project.id}`}
                  className="w-full py-3.5 rounded-xl border border-theme text-high font-bold flex items-center justify-center gap-2 btn-adaptive-hover transition-all"
                  style={{
                    backgroundColor: "var(--theme-color)",
                    color: "contrast-color(var(--theme-color))",
                    borderColor: "transparent",
                  }}
                >
                  Deep Dive <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProjectBoard;
