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
import { getProjectImage } from "../utils/projectMedia";
import { submitToNetlify } from "../utils/form";
import FLFontCarousel from "../components/FLFontCarousel";
import HighlightCarousel from "../components/HighlightCarousel";
import VideoIntroPreview from "../components/VideoIntroPreview";
import { ChevronDown } from "lucide-react";

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
  const { themeColor, activeFontFamily, activeFontScale } =
    useTheme();

  const isHighContrast =
    themeColor.washType === "coal" || themeColor.washType === "light";
  const contrastColor = themeColor.washType === "coal" ? "white" : "black";
  const accentColor = isHighContrast ? contrastColor : themeColor.value;
  const navigate = useNavigate();
  const contactRef = useRef(null);
  const heroRef = useRef(null);
  const [projectsData, setProjectsData] = useState(projectsDataLocal);

  useEffect(() => {
    getProjects().then(setProjectsData);
  }, []);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("submitting");

    submitToNetlify("contact", formState)
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

      {/* spacer / Intro Section */}
      <div className="min-h-screen flex flex-col items-center justify-center p-8 md:p-20 relative overflow-hidden">
        {/* Large Central Font Carousel */}
        {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none opacity-10 select-none">
          <FLFontCarousel
            size="text-[15vw]"
            className="font-black"
            useFullText={false}
            speed={40}
          />
        </div> */}

        <div className="relative z-10 w-full flex flex-col items-center gap-12 md:gap-16 md:pt-10">
          <VideoIntroPreview 
            videoSrc="/media/sample_promo_vid_aigen.mp4"
            className="w-full max-w-5xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] mt-10 md:mt-20" 
          />

          <div className="w-full max-w-4xl flex items-center justify-center pb-24">
            <HighlightCarousel />
          </div>
        </div>

        {/* Scroll Action */}
        <motion.button
          onClick={scrollToHero}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 flex flex-col items-center gap-3 group cursor-pointer z-20"
        >
          <div className="w-9 h-14 rounded-full border-2 border-theme flex justify-center p-1.5 group-hover:border-adaptiv-orange transition-colors">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-adaptiv-orange shadow-[0_0_8px_#ff4d00]"
            />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-low group-hover:text-adaptiv-orange transition-colors">
            Enter Portfolio
          </span>
        </motion.button>
      </div>

      {/* Section 1: Hero */}
      <div ref={heroRef}>
        <ParallaxSection index={0} total={sectionsCount}>
          <div className="py-10">
            <div
              className="max-w-5xl px-6 text-center glass-theme rounded-[32px] md:rounded-[60px] p-6 md:p-20 relative"
              style={{ opacity: 1 }}
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
                    Agentic AI Engineer
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
                <p
                  className="text-base sm:text-lg md:text-2xl font-poppins mb-14 max-w-3xl mx-auto leading-relaxed"
                  style={{ color: "var(--text)" }}
                >
                  Engineering high-performance intelligence pipelines and
                  interactive 3D ecosystems. Converting complex legacy
                  infrastructure into automated future-states.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <button
                    onClick={scrollToContact}
                    className="px-6 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl text-white text-base md:text-lg font-bold hover:scale-105 hover:shadow-2xl btn-adaptive-hover transition-all flex items-center gap-3"
                    style={{
                      backgroundColor: themeColor.value,
                      boxShadow: `0 10px 30px -10px ${themeColor.value}4d`,
                      color: isHighContrast
                        ? themeColor.washType === "light"
                          ? "#000000"
                          : "#ffffff"
                        : "#ffffff",
                    }}
                  >
                    Let's Talk <ChevronRight size={22} />
                  </button>
                  <button
                    onClick={() => navigate("/projects")}
                    className="px-6 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl border-2 border-theme text-high text-base md:text-lg font-bold btn-adaptive-hover transition-all backdrop-blur-sm"
                  >
                    Project Catalog
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </ParallaxSection>
      </div>

      {/* Section 2: Strategy & Contact Form */}
      <ParallaxSection index={1} total={sectionsCount}>
        <div ref={contactRef} className="container mx-auto px-6 py-10">
          <div
            className="glass-theme rounded-[32px] md:rounded-[60px] p-6 md:p-20 relative overflow-hidden group"
            style={{ opacity: 1 }}
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
                  <span
                    style={{
                      color: "var(--heading-color)",
                      textShadow: "var(--heading-shadow)",
                    }}
                  >
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
                        className="w-16 h-16 rounded-[22px] glass-theme glass-theme-hover flex items-center justify-center transition-all duration-500 shadow-inner"
                        style={{ color: accentColor }}
                      >
                        {service.icon}
                      </div>
                      <div>
                        <h6 className="text-2xl font-bold text-high mb-2 tracking-tight group-hover/item:text-adaptiv-orange transition-colors">
                          {service.title}
                        </h6>
                        <p className="text-low font-poppins">{service.desc}</p>
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
                      className="text-2xl md:text-3xl font-comfortaa font-bold text-high mb-2"
                      style={{
                        fontFamily: activeFontFamily,
                        textShadow: "var(--heading-shadow)",
                        fontSize: `calc(2rem * ${activeFontScale})`,
                        lineHeight: 1,
                      }}
                    >
                      Initiate{" "}
                      <span
                        style={{
                          color: "var(--heading-color)",
                          textShadow: "var(--heading-shadow)",
                        }}
                      >
                        Collaboration
                      </span>
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
                          className="w-full border border-theme rounded-2xl px-6 py-4 text-high placeholder:text-high/40 focus:border-adaptiv-orange/50 transition-all outline-none font-poppins"
                          style={{ backgroundColor: "var(--input-bg)" }}
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
                          className="w-full border border-theme rounded-2xl px-6 py-4 text-high placeholder:text-high/40 focus:border-adaptiv-orange/50 transition-all outline-none font-poppins"
                          style={{ backgroundColor: "var(--input-bg)" }}
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
                          className="w-full border border-theme rounded-2xl px-6 py-4 text-high placeholder:text-high/40 focus:border-adaptiv-orange/50 transition-all outline-none font-poppins resize-none"
                          style={{ backgroundColor: "var(--input-bg)" }}
                        ></textarea>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={status === "submitting"}
                        className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-adaptiv-orange/30 btn-adaptive-hover transition-all flex items-center justify-center gap-3 mt-4 ${
                          status === "submitting"
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                        }`}
                        style={{
                          backgroundColor: themeColor.value,
                          color: isHighContrast
                            ? themeColor.washType === "light"
                              ? "#000000"
                              : "#ffffff"
                            : "#ffffff",
                        }}
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
        <div className="py-10">
          <div
            className="container mx-auto px-6 rounded-[32px] md:rounded-[60px] p-6 md:p-20 relative glass-theme"
            style={{ opacity: 1 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
              <div className="max-w-3xl">
                <h3 className="text-3xl sm:text-4xl md:text-6xl font-comfortaa font-bold text-high mb-6">
                  <div
                    className={isHighContrast ? "" : "text-adaptiv-orange"}
                    style={{
                      fontFamily: activeFontFamily,
                      textShadow: "var(--heading-shadow)",
                      fontSize: `calc(3rem * ${activeFontScale})`,
                      lineHeight: 1,
                      color: isHighContrast ? contrastColor : undefined,
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
                className="group flex items-center gap-3 font-bold text-xl transition-colors duration-300 hover:text-hover-bg"
                style={{ color: accentColor }}
              >
                Explore Full Lab{" "}
                <ChevronRight
                  size={24}
                  className="group-hover:translate-x-2 transition-transform duration-300"
                />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
              {heroProjects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -5 }}
                  className="group glass-theme glass-theme-hover rounded-2xl p-6 md:p-8 flex flex-col h-full transition-all relative overflow-hidden"
                >
                  {/* Ambient glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-adaptiv-orange/5 blur-[60px] rounded-full -mr-10 -mt-10 group-hover:bg-adaptiv-orange/10 transition-colors" />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Header Row */}
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
                      <div className="flex gap-2">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-low hover:text-adaptiv-orange transition-colors"
                          title="View Source"
                        >
                          <i className="bi bi-github text-lg"></i>
                        </a>
                        {project.liveUrl !== "#" && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-low hover:text-adaptiv-orange transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className={`text-2xl font-comfortaa font-bold text-high mb-3 transition-colors ${
                      themeColor.washType === "coal" 
                        ? "group-hover:text-white" 
                        : themeColor.washType === "light" 
                          ? "group-hover:text-black" 
                          : "group-hover:text-adaptiv-orange"
                    }`}>
                      {project.title}
                    </h4>

                    {project.subtitle && (
                      <p className="text-[10px] font-bold text-adaptiv-orange uppercase tracking-[0.2em] mb-4 opacity-80">
                        {project.subtitle}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-low text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                      {project.description}
                    </p>

                    <div className="mb-6 overflow-hidden rounded-2xl border border-theme bg-black/10 aspect-[16/9]">
                      <img
                        src={getProjectImage(project)}
                        alt={`${project.title} preview`}
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                      />
                    </div>

                    {/* Tags */}
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

                    {/* Button */}
                    <button
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="w-full py-3.5 rounded-xl border border-theme text-high font-bold flex items-center justify-center gap-2 btn-adaptive-hover transition-all"
                      style={{
                        backgroundColor: "var(--theme-color)",
                        color: "contrast-color(var(--theme-color))",
                        borderColor: "transparent",
                      }}
                    >
                      Case Study <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ParallaxSection>
    </motion.div>
  );
};

export default Home;
