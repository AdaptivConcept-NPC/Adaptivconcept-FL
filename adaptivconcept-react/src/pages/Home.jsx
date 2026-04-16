import React, { useRef, useState, useEffect } from "react";
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
import projectsDataLocal from "../data/projects.json";
import { getProjects } from "../utils/dataStore";
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
  const [projectsData, setProjectsData] = useState(projectsDataLocal);

  useEffect(() => {
    getProjects().then(setProjectsData);
  }, []);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Form State
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const encode = (data) => {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]),
      )
      .join("&");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("submitting");

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "contact", ...formState }),
    })
      .then(() => {
        setStatus("success");
        setFormState({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });
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
      <div
        className="fixed inset-0 transition-colors duration-1000 -z-10 pointer-events-none"
        style={{ backgroundColor: `rgba(var(--theme-color-rgb), 0.05)` }}
      ></div>

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
        <div 
          className="max-w-5xl px-6 text-center glass-theme rounded-[32px] md:rounded-[60px] p-6 md:p-20 relative"  
          style={{ backgroundColor: "var(--glass-bg)", opacity: 1 }}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-theme text-high text-sm font-vietnam mb-10">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: themeColor.value }}
              ></span>
              Available for Strategic Collaboration
            </span>
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl font-comfortaa font-bold mb-10 tracking-tight leading-tight"
              style={{ color: "var(--text-h)" }}
            >
              Senior{" "}
              <span
                className="italic transition-all duration-500 inline-block"
                style={{
                  fontFamily: activeFontFamily,
                  color: "var(--heading-color)",
                  textShadow: "var(--heading-shadow)",
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
                  color: "var(--heading-color)",
                  textShadow: "var(--heading-shadow)",
                  fontSize: `${activeFontScale}em`,
                  lineHeight: 1,
                }}
              >
                Digital Architect
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-2xl font-poppins mb-14 max-w-3xl mx-auto leading-relaxed" style={{ color: "var(--text)" }}>
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
                className="px-6 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl border-2 border-theme text-high text-base md:text-lg font-bold hover:bg-white/5 hover:border-white/20 transition-all backdrop-blur-sm"
              >
                Project Catalog
              </button>
            </div>
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Section 2: Strategy & Contact Form */}
      <ParallaxSection index={1} total={sectionsCount}>
        <div ref={contactRef} className="container mx-auto px-6">
          <div 
            className="glass-theme rounded-[32px] md:rounded-[60px] p-6 md:p-20 relative overflow-hidden group" 
            style={{ backgroundColor: "var(--glass-bg)", opacity: 1 }}
          >
            {/* Subtle glow effect */}
            <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-adaptiv-orange/5 blur-[120px] rounded-full group-hover:bg-adaptiv-orange/10 transition-colors duration-1000"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2
                  className="text-3xl sm:text-4xl md:text-6xl font-bold mb-10 leading-tight transition-all duration-500"
                  style={{
                    color: "var(--text-h)",
                    fontFamily: activeFontFamily,
                    textShadow: "var(--heading-shadow)",
                    fontSize: `calc(3rem * ${activeFontScale})`,
                    lineHeight: 1,
                  }}
                >
                  Design for <br />
                  <span style={{ color: "var(--heading-color)", textShadow: "var(--heading-shadow)" }}>
                    Transformation
                  </span>
                </h2>
                <p className="text-base md:text-lg text-low font-poppins mb-16 leading-relaxed max-w-xl">
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
                        className="w-16 h-16 rounded-[22px] glass-theme flex items-center justify-center transition-all duration-500 shadow-inner group-hover/item:text-white"
                        style={{ color: themeColor.value }}
                      >
                        {service.icon}
                      </div>
                      <div>
                        <h6 className="text-2xl font-bold text-high mb-2 tracking-tight">
                          {service.title}
                        </h6>
                        <p className="text-low font-poppins">
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
                  className="rounded-[32px] md:rounded-[60px] glass-theme p-6 md:p-14 relative group overflow-hidden "
                >
                  <div className="absolute -bottom-24 -left-24 w-[300px] h-[300px] bg-adaptiv-orange/5 blur-[80px] rounded-full group-hover:bg-adaptiv-orange/10 transition-all duration-1000"></div>

                  <div className="relative z-10">
                    <h3
                      className="text-2xl md:text-3xl font-comfortaa font-bold text-white mb-2"
                      style={{
                        fontFamily: activeFontFamily,
                        textShadow: "var(--heading-shadow)",
                        fontSize: `calc(2rem * ${activeFontScale})`,
                        lineHeight: 1,
                      }}
                    >
                      Initiate{" "}
                      <span style={{ color: "var(--heading-color)", textShadow: "var(--heading-shadow)" }}>Collaboration</span>
                    </h3>
                    <p className="text-low text-sm font-poppins mb-10">
                      Ready to engineer the future? Drop a brief below.
                    </p>

                    <form
                      name="contact"
                      method="POST"
                      data-netlify="true"
                      data-netlify-honeypot="bot-field"
                      className="space-y-6"
                      onSubmit={handleSubmit}
                    >
                      <input type="hidden" name="form-name" value="contact" />
                      <p className="hidden">
                        <label>
                          Don't fill this out if you're human:{" "}
                          <input name="bot-field" />
                        </label>
                      </p>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-high uppercase tracking-[0.2em] ml-2">
                          Identification
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formState.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Professional Name"
                          className="w-full bg-white/5 border border-theme rounded-2xl px-6 py-4 text-high placeholder:text-high/40 focus:border-adaptiv-orange/50 focus:bg-white/[0.08] transition-all outline-none font-poppins"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-high uppercase tracking-[0.2em] ml-2">
                          Communication Channel
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          required
                          placeholder="email@organization.com"
                          className="w-full bg-white/5 border border-theme rounded-2xl px-6 py-4 text-high placeholder:text-high/40 focus:border-adaptiv-orange/50 focus:bg-white/[0.08] transition-all outline-none font-poppins"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-high uppercase tracking-[0.2em] ml-2">
                          Mission Parameters
                        </label>
                        <textarea
                          name="message"
                          value={formState.message}
                          onChange={handleInputChange}
                          required
                          rows="4"
                          placeholder="Describe the architectural challenge..."
                          className="w-full bg-white/5 border border-theme rounded-2xl px-6 py-4 text-high placeholder:text-high/40 focus:border-adaptiv-orange/50 focus:bg-white/[0.08] transition-all outline-none font-poppins resize-none"
                        ></textarea>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={status === "submitting"}
                        className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl bg-adaptiv-orange text-white font-bold text-lg hover:shadow-2xl hover:shadow-adaptiv-orange/30 transition-all flex items-center justify-center gap-3 mt-4 ${
                          status === "submitting"
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {status === "idle" && (
                          <>
                            Deploy Brief <Rocket size={20} />
                          </>
                        )}
                        {status === "submitting" && "Transmitting..."}
                        {status === "success" && "Transmission Successful!"}
                        {status === "error" && "Link Fault. Retrying..."}
                      </motion.button>

                      {status === "success" && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-adaptiv-orange text-center font-bold text-sm mt-4"
                        >
                          Protocol accepted. I'll get back to you shortly.
                        </motion.p>
                      )}
                    </form>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Section 3: Github Projects Grid */}
      <ParallaxSection index={2} total={sectionsCount}>
        <div 
          className="container mx-auto px-6 rounded-[32px] md:rounded-[60px] p-6 md:p-20 relative glass-theme" 
          style={{ backgroundColor: "var(--glass-bg)", opacity: 1 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
            <div className="max-w-3xl">
              <h3 className="text-3xl sm:text-4xl md:text-6xl font-comfortaa font-bold text-high mb-6">
                <div
                  className="text-adaptiv-orange"
                  style={{
                    fontFamily: activeFontFamily,
                    textShadow: "var(--heading-shadow)",
                    fontSize: `calc(3rem * ${activeFontScale})`,
                    lineHeight: 1,
                  }}
                >
                  Github
                </div>{" "}
                Masterpieces
              </h3>
              <p className="text-lg md:text-2xl text-low font-comfortaa">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {heroProjects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -15, scale: 1.02 }}
                className="group glass-card rounded-[24px] md:rounded-[40px] p-6 md:p-10 flex flex-col h-full transition-all duration-500 shadow-2xl"
              >
                <div className="flex flex-wrap flex-col md:flex-row justify-between items-start gap-4 mb-2">
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <span className="pe-5 py-2 rounded-xl bg-adaptiv-orange/10 text-adaptiv-orange text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                      {project.category}
                    </span>
                    <h4 className="text-2xl md:text-3xl font-comfortaa font-bold text-high mb-2 group-hover:text-adaptiv-orange transition-colors" 
                    style={{fontSize:"150%"}}>
                      {project.title}
                    </h4>

                    {project.subtitle && (
                      <p className="text-xs md:text-sm font-medium text-low italic opacity-80 uppercase tracking-widest">
                        {project.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 justify-end w-full md:w-auto flex-shrink-0">
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


                <p className="text-low font-poppins line-clamp-3 mb-10 text-base md:text-lg flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-10">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 rounded-lg bg-adaptiv-orange/5 border border-adaptiv-orange/10 text-[10px] text-adaptiv-orange font-bold uppercase tracking-widest"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                   onClick={() => navigate(`/projects/${project.id}`)}
                   className="w-full py-4 rounded-2xl border-2 border-theme text-high font-bold text-lg hover:bg-adaptiv-orange hover:border-adaptiv-orange transition-all duration-300 group-hover:shadow-lg group-hover:shadow-adaptiv-orange/20"
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
