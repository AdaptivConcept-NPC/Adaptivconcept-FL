import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Rocket, Terminal, Cpu, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import projectsDataLocal from "../data/projects.json";
import { getProjects } from "../utils/dataStore";

const ProjectBoard = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectsData, setProjectsData] = useState(projectsDataLocal);

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
      style={{ marginTop: "200px", backgroundColor: "rgba(15, 15, 16, 0.7)", opacity: 1}}
    >
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-comfortaa font-bold text-white mb-6">
          Project <span className="text-adaptiv-orange">Board</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 font-poppins max-w-2xl mx-auto">
          A segmented showcase of technical explorations, business solutions,
          and research.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="max-w-5xl mx-auto mb-20">
        <div className="glass-theme rounded-[24px] md:rounded-[32px] p-3 md:p-4 flex flex-col lg:flex-row items-center gap-4 md:gap-6 shadow-2xl">
          <div className="w-full lg:flex-grow relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-adaptiv-orange transition-colors"
              size={20}
            />
            <input
              type="text"
              className="w-full bg-black/20 border border-white/5 text-white pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:border-adaptiv-orange/40 transition-all font-poppins placeholder:text-gray-600"
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
                    : "glass-theme text-gray-400 hover:text-white transition-all"
                }`}
              >
                {cat}
              </button>
            ))}
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
                    <span className="text-xs uppercase font-bold tracking-[0.2em] text-gray-500">
                      {project.category}
                    </span>
                  </div>
                  {project.isHero && (
                    <span className="px-3 py-1 rounded-full bg-adaptiv-orange text-[10px] font-black tracking-tighter text-white">
                      FEATURED
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-comfortaa font-bold text-white mb-3 group-hover:text-adaptiv-orange transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-gray-500 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/projects/${project.id}`}
                  className="w-full py-3.5 rounded-xl border border-white/10 text-white font-bold flex items-center justify-center gap-2 group-hover:bg-adaptiv-orange group-hover:border-adaptiv-orange transition-all"
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
