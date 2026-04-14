import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Terminal,
  Cpu,
  Rocket,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import projectsData from "../data/projects.json";
import FLFontCarousel from "../components/FLFontCarousel";
import HighlightCarousel from "../components/HighlightCarousel";
import MouseScrollIndicator from "../components/MouseScrollIndicator";

const ParallaxSection = ({ children, index, total }) => {
  const container = useRef(null);

  // Track scroll progress of this section relative to the viewport
  // offset: ["start start", "end start"] means progress goes from 0 to 1
  // while the section's start is at the top of the viewport until its end hits the top.
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });

  // Scale and Opacity transform:
  // - As the section hits the top (0), it is at 1.0 scale.
  // - As the NEXT section covers it (moving towards 1.0 progress), it shrinks to 0.8 and fades.
  // The very last section doesn't need to shrink (index === total - 1).
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, index === total - 1 ? 1 : 0.8],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    [1, index === total - 1 ? 1 : 0.6],
  );

  return (
    <div
      ref={container}
      className="relative min-h-screen"
      style={{ zIndex: index + 10 }}
    >
      <div className="sticky top-0 min-h-screen w-full overflow-hidden flex items-center justify-center">
        <motion.div
          style={{
            scale,
            opacity,
          }}
          className="w-full h-full flex items-center justify-center pt-20"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

const Home = () => {
  const { themeColor, currentFont, activeFontFamily, activeFontScale } =
    useTheme();
  const navigate = useNavigate();
  const contactRef = useRef(null);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const heroProjects = projectsData.filter((p) => p.isHero);
  const sectionsCount = 3;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full relative bg-transparent"
    >
      {/* Background Overlay to ensure contrast over the video/wallpaper */}
      <div className="fixed inset-0 bg-[#0f0f10]/10 -z-10 pointer-events-none"></div>

      {/* spacer */}
      <div className="h-screen flex flex-col justify-end items-center p-8">
        {/* I need this spacer to contain a centraly justified & aligned 
        FLFontCarousel component that is very large, below it shouuld be
        a scroll-down button that smooth-scolls to the Hero section. */}
        {/* <FLFontCarousel size="text-12xl" className="mb-8" useFullText={false} /> */}

        <div className="w-full max-w-4xl min-h-[200px] flex items-center justify-center my-16">
          <HighlightCarousel />
        </div>

        <MouseScrollIndicator />
      </div>

      {/* Section 1: Hero */}
      <ParallaxSection index={0} total={sectionsCount}>
        <div className="max-w-5xl px-6 text-center bg-[#0f0f10]/60  backdrop-blur-3xl border border-white/10 rounded-[32px] md:rounded-[60px] p-6 md:p-20 relative">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-vietnam mb-10 backdrop-blur-xl">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: themeColor.value }}
              ></span>
              Available for Strategic Collaboration
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-comfortaa font-bold mb-10 tracking-tight text-white leading-tight">
              Senior{" "}
              <span
                className="italic transition-all duration-500 inline-block"
                style={{
                  fontFamily: activeFontFamily,
                  color: themeColor.value,
                  fontSize: `${activeFontScale}em`,
                  lineHeight: 1,
                }}
              >
                AI Engineer
              </span>{" "}
              & <br />
              <span
                className="italic transition-all duration-500 inline-block"
                style={{
                  fontFamily: activeFontFamily,
                  color: themeColor.value,
                  fontSize: `${activeFontScale}em`,
                  lineHeight: 1,
                }}
              >
                Digital Architect
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-2xl font-poppins text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed">
              Engineering high-performance intelligence pipelines and
              interactive 3D ecosystems. Converting complex legacy
              infrastructure into automated future-states.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={scrollToContact}
                className="px-6 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl text-white text-base md:text-lg font-bold hover:scale-105 hover:shadow-2xl transition-all flex items-center gap-3"
                style={{
                  backgroundColor: themeColor.value,
                  boxShadow: `0 10px 30px -10px ${themeColor.value}4d`,
                }}
              >
                Let's Talk <ChevronRight size={22} />
              </button>
              <button
                onClick={() => navigate("/projects")}
                className="px-6 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl border-2 border-white/10 text-white text-base md:text-lg font-bold hover:bg-white/5 hover:border-white/20 transition-all backdrop-blur-sm"
              >
                Project Catalog
              </button>
            </div>
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Section 2: Strategy */}
      <ParallaxSection index={1} total={sectionsCount}>
        <div ref={contactRef} className="container mx-auto px-6">
          <div className="bg-[#0f0f10]/60 backdrop-blur-3xl border border-white/10 rounded-[32px] md:rounded-[60px] p-6 md:p-20 relative overflow-hidden group">
            {/* Subtle glow effect */}
            <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-adaptiv-orange/5 blur-[120px] rounded-full group-hover:bg-adaptiv-orange/10 transition-colors duration-1000"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2
                  className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-10 leading-tight transition-all duration-500"
                  style={{
                    fontFamily: activeFontFamily,
                    textShadow: "3px 3px 0px rgba(0,0,0,0.5)",
                    fontSize: `calc(3rem * ${activeFontScale})`,
                    lineHeight: 1,
                  }}
                >
                  Design for <br />
                  <span style={{ color: themeColor.value }}>
                    Transformation
                  </span>
                </h2>
                <p className="text-base md:text-lg text-gray-400 font-poppins mb-16 leading-relaxed max-w-xl">
                  Leveraging deep expertise in public sector innovation and AI
                  research to help forward-thinking teams skip the prototype
                  phase and build production-ready systems.
                </p>

                <div className="space-y-10">
                  {[
                    {
                      icon: <Terminal size={28} />,
                      title: "Intelligence & LLM OPS",
                      desc: "Production-grade RAG and agentic workflows.",
                    },
                    {
                      icon: <Cpu size={28} />,
                      title: "Core Architecture",
                      desc: "Scalable React & Cloud-First infrastructures.",
                    },
                    {
                      icon: <Rocket size={28} />,
                      title: "Visual Frontiers",
                      desc: "Immersive WebGL and high-fidelity user experiences.",
                    },
                  ].map((service, i) => (
                    <div key={i} className="flex gap-8 group/item">
                      <div
                        className="w-16 h-16 rounded-[22px] bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 shadow-inner group-hover/item:text-white"
                        style={{ color: themeColor.value }}
                      >
                        {service.icon}
                      </div>
                      <div>
                        <h6 className="text-2xl font-bold text-white mb-2 tracking-tight">
                          {service.title}
                        </h6>
                        <p className="text-gray-400 font-poppins">
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Contact Form Replacement */}
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="rounded-[32px] md:rounded-[60px] bg-white/[0.05] backdrop-blur-3xl border border-white/10 p-6 md:p-14 relative group overflow-hidden"
                >
                  <div className="absolute -bottom-24 -left-24 w-[300px] h-[300px] bg-adaptiv-orange/5 blur-[80px] rounded-full group-hover:bg-adaptiv-orange/10 transition-all duration-1000"></div>

                  <div className="relative z-10">
                    <h3
                      className="text-2xl md:text-3xl font-comfortaa font-bold text-white mb-2"
                      style={{
                        fontFamily: activeFontFamily,
                        textShadow: "3px 3px 0px rgba(0,0,0,0.5)",
                        fontSize: `calc(2rem * ${activeFontScale})`,
                        lineHeight: 1,
                      }}
                    >
                      Initiate{" "}
                      <span className="text-adaptiv-orange">Collaboration</span>
                    </h3>
                    <p className="text-gray-400 text-sm font-poppins mb-10">
                      Ready to engineer the future? Drop a brief below.
                    </p>

                    <form
                      className="space-y-6"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white uppercase tracking-[0.2em] ml-2">
                          Identification
                        </label>
                        <input
                          type="text"
                          placeholder="Professional Name"
                          className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 focus:border-adaptiv-orange/50 focus:bg-white/[0.08] transition-all outline-none font-poppins"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white uppercase tracking-[0.2em] ml-2">
                          Communication Channel
                        </label>
                        <input
                          type="email"
                          placeholder="email@organization.com"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 focus:border-adaptiv-orange/50 focus:bg-white/[0.08] transition-all outline-none font-poppins"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white uppercase tracking-[0.2em] ml-2">
                          Mission Parameters
                        </label>
                        <textarea
                          rows="4"
                          placeholder="Describe the architectural challenge..."
                          className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 focus:border-adaptiv-orange/50 focus:bg-white/[0.08] transition-all outline-none font-poppins resize-none"
                        ></textarea>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl bg-adaptiv-orange text-white font-bold text-lg hover:shadow-2xl hover:shadow-adaptiv-orange/30 transition-all flex items-center justify-center gap-3 mt-4"
                      >
                        Deploy Brief <Rocket size={20} />
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Section 3: Projects Grid */}
      <ParallaxSection index={2} total={sectionsCount}>
        <div className="container mx-auto px-6 bg-[#0f0f10]/60  backdrop-blur-3xl border border-white/10 rounded-[32px] md:rounded-[60px] p-6 md:p-20 relative">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
            <div className="max-w-3xl">
              <h3 className="text-3xl sm:text-4xl md:text-6xl font-comfortaa font-bold text-white mb-6">
                <div
                  className="text-adaptiv-orange"
                  style={{
                    fontFamily: activeFontFamily,
                    textShadow: "3px 3px 0px rgba(0,0,0,0.5)",
                    fontSize: `calc(3rem * ${activeFontScale})`,
                    lineHeight: 1,
                  }}
                >
                  Github
                </div>{" "}
                Masterpieces
              </h3>
              <p className="text-lg md:text-2xl text-gray-400 font-comfortaa">
                Selected engineering feats and design systems.
              </p>
            </div>
            <button
              onClick={() => navigate("/projects")}
              className="group flex items-center gap-3 text-adaptiv-orange font-bold text-xl hover:text-white transition-colors duration-300"
            >
              Explore Full Lab{" "}
              <ChevronRight
                size={24}
                className="group-hover:translate-x-2 transition-transform duration-300"
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
            {heroProjects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -15, scale: 1.02 }}
                className="group bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[24px] md:rounded-[40px] p-6 md:p-10 flex flex-col h-full transition-all duration-500 hover:bg-white/10 hover:border-adaptiv-orange/30 shadow-2xl"
              >
                <div className="flex justify-between items-start mb-10">
                  <span className="px-5 py-2 rounded-xl bg-adaptiv-orange/10 text-adaptiv-orange text-sm font-bold uppercase tracking-[0.2em]">
                    {project.category}
                  </span>
                  <div className="flex gap-4">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-adaptiv-orange hover:border-adaptiv-orange hover:scale-110 transition-all duration-300"
                    >
                      <i className="bi bi-github text-xl"></i>
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-adaptiv-orange hover:border-adaptiv-orange hover:scale-110 transition-all duration-300"
                    >
                      <ExternalLink size={22} />
                    </a>
                  </div>
                </div>

                <h4 className="text-2xl md:text-3xl font-comfortaa font-bold text-white mb-6 group-hover:text-adaptiv-orange transition-colors">
                  {project.title}
                </h4>

                <p className="text-gray-400 font-poppins line-clamp-3 mb-10 text-base md:text-lg flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-10">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-gray-500 font-bold uppercase tracking-widest"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="w-full py-4 rounded-2xl border-2 border-white/10 text-white font-bold text-lg hover:bg-adaptiv-orange hover:border-adaptiv-orange transition-all duration-300 group-hover:shadow-lg group-hover:shadow-adaptiv-orange/20"
                >
                  Case Study Details
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>
    </motion.div>
  );
};

export default Home;
