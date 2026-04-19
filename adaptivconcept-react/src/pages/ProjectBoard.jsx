import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Rocket, Terminal, Cpu, ChevronRight, Sparkles, Zap } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import projectsDataLocal from "../data/projects.json";
import { getProjects } from "../utils/dataStore";

const ProjectBoard = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectsData, setProjectsData] = useState(projectsDataLocal);
  const { isOverkillEnabled, setIsOverkillEnabled } = useTheme();

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 py-10 md:py-20 min-h-screen rounded-[32px] md:rounded-[60px] glass-theme"
      style={{ marginTop: "200px", backgroundColor: "var(--glass-bg)", opacity: 1}}
    >
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-comfortaa font-bold text-high mb-6">
          Project <span className="text-adaptiv-orange">Board</span>
        </h1>
        <p className="text-lg md:text-xl text-low font-poppins max-w-2xl mx-auto">
          A segmented showcase of technical explorations, business solutions,
          and research.
        </p>
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
              className="w-full bg-black/20 border border-theme text-high pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:border-adaptiv-orange/40 transition-all font-poppins placeholder:text-low/60"
              placeholder="Search by tech stack or name..."
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
                    ? "bg-adaptiv-orange text-white shadow-lg shadow-adaptiv-orange/20"
                    : "glass-theme text-low hover:text-high transition-all"
                }`}
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
                title={isOverkillEnabled ? "Experimental Fonts Active (Heavy)" : "Load Experimental Fonts (17MB+)"}
            >
                {isOverkillEnabled ? <Sparkles size={18} /> : <Zap size={18} />}
                <span className="text-xs font-bold hidden sm:inline">
                    {isOverkillEnabled ? "Experimental Active" : "Load XP Fonts"}
                </span>
            </button>
          </div>
        </div>
      </div>

      {/* Dev Labs Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
            <h2 className="text-3xl font-comfortaa font-bold text-high flex items-center gap-3">
              <Terminal className="text-adaptiv-orange" /> Dev <span className="text-adaptiv-orange">Labs</span>
            </h2>
            <p className="text-low text-sm mt-2">Interactive environments and experimental portals.</p>
          </div>
          <Link to="/tech-wall" className="text-xs font-bold hover:underline tracking-widest uppercase flex items-center gap-2"
            style={{ color: 'var(--theme-color)' }}
          >
            View Stack <ChevronRight size={14} />
          </Link>
        </div>

        <div className="relative group/labs">
          <motion.div 
            className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ right: 0, left: -400 }} // Simple constraint, can be calculated dynamically
          >
            {/* PySwissShef Lab Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="min-w-[300px] md:min-w-[400px] snap-start"
            >
              <div className="glass-theme rounded-[32px] p-8 h-full border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-adaptiv-orange/10 blur-3xl rounded-full -mr-10 -mt-10" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-adaptiv-orange/20 text-adaptiv-orange">
                      <Rocket size={24} />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-black tracking-tighter uppercase border border-green-500/30">
                      Active Lab
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-high mb-2">PySwissShef Lab</h3>
                  <p className="text-low text-sm leading-relaxed mb-6">
                    Interactive Python & Shell catalogue hosted on StackBlitz. Test automation recipes instantly.
                  </p>

                  <div className="flex items-center gap-2 mb-8">
                     <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-low border border-white/5">Python</span>
                     <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-low border border-white/5">Shell</span>
                     <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-low border border-white/5">WASM</span>
                  </div>

                  <Link 
                    to="/labs/pyswissshef"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold hover:bg-hover-bg hover:text-hover-text transition-all shadow-lg shadow-adaptiv-orange/20"
                    style={{ backgroundColor: 'var(--theme-color)', color: themeColor.washType === 'light' ? '#000000' : '#ffffff' }}
                  >
                    Enter Lab <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Placeholder Lab 1 */}
            <div className="min-w-[300px] md:min-w-[400px] snap-start opacity-50 grayscale hover:grayscale-0 transition-all">
              <div className="glass-theme rounded-[32px] p-8 h-full border border-white/5 flex flex-col justify-between">
                <div>
                   <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
                      <Cpu size={24} />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-low text-[10px] font-black tracking-tighter uppercase border border-white/10">
                      Upcoming
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-high mb-2">AI Analytics Lab</h3>
                  <p className="text-low text-sm leading-relaxed mb-6">
                    Large-scale data processing and AI model refinement workbench.
                  </p>
                </div>
                <button disabled className="w-full py-3 rounded-xl border border-white/10 text-low font-bold cursor-not-allowed">
                  Under Construction
                </button>
              </div>
            </div>

            {/* Placeholder Lab 2 */}
            <div className="min-w-[300px] md:min-w-[400px] snap-start opacity-30">
              <div className="glass-theme rounded-[32px] p-8 h-full border border-white/5 flex flex-col justify-between italic">
                <div className="text-center py-10">
                   <p className="text-low text-sm">More Labs Coming Soon...</p>
                </div>
              </div>
            </div>

          </motion.div>
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
                    <span className="px-3 py-1 rounded-full bg-adaptiv-orange text-[10px] font-black tracking-tighter text-white">
                      FEATURED
                    </span>
                  )}
                </div>

                <h3 className={`text-2xl font-comfortaa font-bold text-high mb-3 transition-colors ${themeColor.washType === 'coal' ? 'group-hover:text-white' : themeColor.washType === 'light' ? 'group-hover:text-black' : 'group-hover:text-adaptiv-orange'}`}>
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
                  className="w-full py-3.5 rounded-xl border border-theme text-high font-bold flex items-center justify-center gap-2 hover:bg-hover-bg hover:text-hover-text hover:border-hover-bg transition-all"
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
