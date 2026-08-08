import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const highlights = [
  {
    title: "Frontend Engineering",
    subtitle:
      "Specializing in React, Vanilla JS, and jQuery to build 100% pixel-perfect, highly interactive user interfaces. #HTML #CSS #VanillaJS #jQuery",
    techStack: [
      "react",
      "wordpress",
      "vscode",
      "github",
      "canva",
      "illustrator",
      "figma",
    ],
  },
  {
    title: "Backend Authority",
    subtitle:
      "Architecting robust systems with Vanilla PHP, Laravel, Node.js, C# and Python for secure, high-traffic business & community applications. #PHP #Laravel #csharp #Node",
    techStack: ["php", "mysql", "docker", "redis", "linux", "azure", "csharp"], // add csharp icon
  },
  {
    title: "Data Intelligence",
    subtitle:
      "Leveraging Python and Power BI to transform complex business and community health data into visual, actionable strategic insights. #Python #DataAnalysis",
    techStack: ["python", "powerbi", "postgresql", "tableau", "zebrabi"], // add tableau and zebrabi
  },
  {
    title: "Process Automation",
    subtitle:
      "Mastering Microsoft Fabric, Power Automate and Power Apps to streamline enterprise-level business operations. #PowerPlatform",
    techStack: ["powerautomate", "powerapps", "m365", "terminal", "api"], 
  },
  {
    title: "Database Scalability",
    subtitle:
      "Expert-level administration of MySQL and SQL Server environments for mission-critical data integrity. #MySQL #SQLServer",
    techStack: [
      "mysql",
      "sqlserver",
      "postgresql",
      "redis",
      "firebase",
      "supabase",
    ],
  },
  {
    title: "Award-Winning Innovation",
    subtitle:
      "Gold Award Innovator recognized for pioneering digital patient experience solutions at a national level.",
    techStack: ["ai", "chatgpt", "claude", "ollama"], 
    },
  {
    title: "Cloud & Shared-Hosting Ecosystems",
    subtitle:
      "Bridging the gap between enterprise legacy and modern cloud-native solutions with Linux, CPanel, Microsoft 365 and Azure. #M365 #Azure",
    techStack: ["m365", "azure", "copilot", "github-copilot", "cpanel"],
  },
];

const iconMap = {
  react: "/icons/icons8-react-shadow/icons8-react-96.png",
  vscode:
    "/icons/icons8-visual-studio-code-2019-windows-11-color/icons8-visual-studio-code-2019-96.png",
  github: "/icons/icons8-github-shadow/icons8-github-96.png",
  php: "/icons/icons8-php-shadow/icons8-php-96.png",
  mysql: "/icons/icons8-mysql-shadow/icons8-mysql-96.png",
  docker: "/icons/icons8-docker-shadow/icons8-docker-96.png",
  redis: "/icons/icons8-redis-shadow/icons8-redis-96.png",
  linux: "/icons/icons8-linux-shadow/icons8-linux-96.png",
  azure: "/icons/icons8-azure-windows-11-color/icons8-azure-96.png",
  python: "/icons/icons8-python-shadow/icons8-python-96.png",
  powerbi:
    "/icons/icons8-power-bi-2021-windows-11-color/icons8-power-bi-2021-96.png",
  postgresql: "/icons/icons8-postgresql-shadow/icons8-postgresql-96.png",
  powerautomate:
    "/icons/icons8-microsoft-power-automate-2020-windows-11-color/icons8-microsoft-power-automate-2020-96.png",
  powerapps:
    "/icons/icons8-microsoft-power-apps-2020-windows-11-color/icons8-microsoft-power-apps-2020-96.png",
  m365: "/icons/icons8-microsoft-365-windows-11-color/icons8-microsoft-365-96.png",
  ai: "/icons/icons8-ai-windows-11-color/icons8-ai-96.png",
  chatgpt: "/icons/icons8-chatgpt-windows-11-color/icons8-chatgpt-96.png",
  claude: "/icons/icons8-claude-ai-windows-11-color/icons8-claude-ai-96.png",
  copilot:
    "/icons/icons8-microsoft-copilot-windows-11-color/icons8-microsoft-copilot-96.png",
  "github-copilot":
    "/icons/icons8-github-copilot-windows-11-color/icons8-github-copilot-96.png",
  sqlserver:
    "/icons/icons8-microsoft-sql-server-color/icons8-microsoft-sql-server-96.png",
  wordpress: "/icons/icons8-wordpress-color/icons8-wordpress-96.png",
  canva: "/icons/icons8-canva-windows-11-color/icons8-canva-96.png",
  illustrator: "/icons/icons8-illustrator-color/icons8-illustrator-96.png",
  figma: "/icons/icons8-figma-color/icons8-figma-96.png",
  cpanel: "/icons/icons8-cpanel-windows-10/icons8-cpanel-96.png",
  csharp: "/icons/icons8-c-sharp-logo-gradient/icons8-c-sharp-logo-96.png",
  terminal: "/icons/icons8-terminal-3d-fluency/icons8-terminal-94.png",
  api: "/icons/icons8-api-3d-fluency/icons8-api-94.png",
  firebase: "/icons/icons8-firebase-color/icons8-firebase-96.png",
  supabase: "/icons/icons8-supabase-windows-11-color/icons8-supabase-96.png",
  ollama: "/icons/ollama/ollama-color.svg",
  tableau: "/icons/tableau/Tableau-Logo.png",
  zebrabi: "/icons/zebrabi/Zebra BI logo landscape.png",
};

const HighlightCarousel = ({ className = "" }) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const { themeColor, activeFontFamily, activeFontScale } = useTheme();

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % highlights.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % highlights.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev + highlights.length - 1) % highlights.length);
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  const current = highlights[index];

  // Variants for the wave hover animation
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.4,
      },
    },
    hover: { transition: { staggerChildren: 0.1 } },
  };

  const iconVariants = {
    initial: { opacity: 0, x: -40, scale: 0.5 },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 15,
      },
    },
    hover: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  const handleTechClick = () => {
    navigate("/tech-wall");
  };

  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center text-center px-4 py-8 group/carousel ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >

      
      {/* Navigation Buttons - Hidden on Mobile, Desktop Only */}
      <button
        onClick={handlePrev}
        className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-white/5 backdrop-blur-md border border-theme text-low hover:text-adaptiv-orange hover:bg-white/10 hover:border-adaptiv-orange/50 transition-all duration-300 group shadow-xl"
        aria-label="Previous slide"
      >
        <ChevronLeft
          size={32}
          className="transition-transform group-hover:-translate-x-1"
        />
      </button>

      <button
        onClick={handleNext}
        className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-white/5 backdrop-blur-md border border-theme text-low hover:text-adaptiv-orange hover:bg-white/10 hover:border-adaptiv-orange/50 transition-all duration-300 group shadow-xl"
        aria-label="Next slide"
      >
        <ChevronRight
          size={32}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>

      <div className="w-full max-w-5xl overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div
            key={`highlight-${index}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center gap-4 cursor-grab active:cursor-grabbing touch-none"
          >
            <h3
              className={`text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight uppercase select-none my-4 transition-all duration-500 responsive-heading-scale`}
              style={{
                textShadow: "var(--heading-shadow)",
                WebkitTextStroke: themeColor.washType === "coal"
                    ? "0.1px #ffffff"
                    : themeColor.washType === "light"
                      ? "0.1px #000000"
                      : "0.15px #000000",
                color: "var(--heading-color)",
                fontFamily: activeFontFamily,
                // Provide the active font scale to the CSS utility via a CSS variable
                ["--heading-scale"]: activeFontScale,
                lineHeight: "0.9",
              }}
            >
              {current.title}
            </h3>

            {/* Stack-aware Tech Icons with Wave Animation */}
            <div
              className="p-1 md:p-2 rounded-full shadow-2xl bg-white border-b-4 cursor-pointer hover:scale-105 transition-transform group/icons"
              style={{ borderBottomColor: themeColor.value }}
              onClick={handleTechClick}
              title="View Wall of Stacked-Tech🔥"
            >
              
              {/* Tech Icons */}
              <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                className="hidden md:flex items-center h-12 p-4"
              >
                {current.techStack?.map((tech, i) => (
                  <motion.div
                    key={`${tech}-${i}`}
                    variants={iconVariants}
                    className="relative group m-0"
                    style={{ zIndex: 10 + i }}
                  >
                    <img
                      src={iconMap[tech]}
                      alt={tech}
                      className="w-10 h-10 mx-4 object-contain drop-shadow-lg filter brightness-110 group-hover:scale-125 transition-transform duration-300"
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Mobile Label */}
              <div className="flex md:hidden items-center justify-center h-12 px-8">
                <span className="text-sm font-bold tracking-tighter text-black flex items-center gap-2">
                  Wall of Stacked-Tech🔥 <Rocket size={16} />
                </span>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-high text-sm sm:text-base md:text-lg max-w-3xl font-medium italic select-none px-6 py-3 rounded-2xl bg-black/10 backdrop-blur-[2px] border border-white/5"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
            >
              {current.subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle indicator - Adjusted for spacing */}
      <div className="flex gap-3 mt-12 mb-4">
        {highlights.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-10" : "bg-gray-800/50 w-5"
            }`}
            style={{
              backgroundColor: i === index ? themeColor.value : undefined,
              boxShadow: i === index ? `0 0 10px ${themeColor.value}80` : "none",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HighlightCarousel;
