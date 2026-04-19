import React, { useState } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import FLFontCarousel from "./FLFontCarousel";

const ProfilePersonas = ({ onPersonaHover }) => {
  const personas = [
    {
      id: 1,
      src: "/media/my-profile-pic-microsoft-original.png",
      label: "Professional",
    },
    {
      id: 2,
      src: "/media/my-profile-pic-microsoft-vector.png",
      label: "Corporate Vector",
    },
    { id: 3, src: "/media/my-profile-pic-github.jpg", label: "Developer" },
    {
      id: 4,
      src: "/media/my-profile-pic-github-vector.png",
      label: "Tech Vector",
    },
  ];

  return (
    <motion.div
      whileHover="hover"
      className="relative group w-48 h-48 md:w-64 md:h-64 mx-auto md:ml-auto md:mr-0 perspective-1000"
    >
      {personas.map((persona, index) => (
        <motion.div
          key={persona.id}
          className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-sm cursor-pointer"
          style={{
            zIndex: personas.length - index,
          }}
          initial={{
            rotateZ: index * -3,
            x: index * 2,
            y: index * 2,
            opacity: 1,
          }}
          animate={{
            rotateZ: index * -3,
            x: index * 2,
            y: index * 2,
            scale: 1,
            boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.3)",
          }}
          variants={{
            hover: {
              rotateZ: (index - 3) * 15,
              x: (index - 3) * 130,
              y: index * -5 - 30,
              scale: 0.9,
              transition: { type: "spring", stiffness: 300, damping: 25 },
            },
          }}
          whileHover={{
            scale: 1.15,
            y: index * -5 - 60,
            zIndex: 100,
            boxShadow: "0 50px 100px -20px rgba(0, 0, 0, 1)",
            rotateZ: (index - 3) * 20,
            transition: { type: "spring", stiffness: 450, damping: 15 },
          }}
          onHoverStart={() => onPersonaHover(persona.id)}
          onHoverEnd={() => onPersonaHover(null)}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <img
            src={persona.src}
            alt={persona.label}
            className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white block text-center">
              {persona.label}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const Footer = () => {
  const [hoveredPersona, setHoveredPersona] = useState(null);

  const personaMessages = {
    1: "Enterprise-grade engineering with Microsoft-standard precision and reliable architectural patterns.",
    2: "Architecting the technical future through strategic digital transformation and high-level design.",
    3: "Specializing in the visual intelligence layer: bridging the gap between raw data and clarity.",
    4: "Rapid innovation powered by local LLMs, open-source stacks, and agile development cycles.",
  };

  const defaultMessage = "Professional integrity in every line of code.";

  return (
    <footer className="py-12 mt-20 relative z-10 border-t border-theme" style={{ backgroundColor: 'var(--bg)', opacity: 0.9 }}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Brand & LinkedIn Card */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center gap-2 mb-6 group cursor-default">
                  <div className="flex flex-col items-center">
                    <img
                      // src="/media/0_75xLogo.png"
                      src="/media/Adaptiv Media Concept Logo.png"
                      className="h-20 group-hover:scale-110 transition-transform duration-300"
                      alt="adaptivconcept fl logo"
                    />
                    <h5 className="text-lg md:text-xl font-comfortaa font-bold text-high tracking-tight relative">
                      AdaptivConcept
                      <div
                        style={{
                          position: "absolute",
                          fontSize: "8px",
                          marginTop: "-6px",
                          marginRight: "-4px",
                          top: "0",
                          right: "0",
                        }}
                      >
                        ™
                      </div>
                    </h5>
                    <FLFontCarousel
                      size="text-xl md:text-2xl"
                      useFullText={true}
                      className="ml-2 w-auto min-h-0"
                    />
                  </div>
                </div>

                {/* LinkedIn Card */}
                <div className="mb-5">
                  <motion.div
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="group relative flex flex-col sm:flex-row items-center gap-6 p-4 md:p-6 rounded-2xl md:rounded-[24px] glass-theme border border-theme backdrop-blur-3xl hover:border-[#0077b5]/50 transition-all duration-500 max-w-lg w-full overflow-hidden"
                    style={{ backgroundColor: 'var(--glass-bg)' }}
                  >
                    {/* LinkedIn-branded accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0077b5]/10 blur-[60px] -mr-10 -mt-10 group-hover:bg-[#0077b5]/20 transition-all duration-700"></div>

                    <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-[#0077b5] flex items-center justify-center text-white border border-[#0077b5]/30 overflow-hidden shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <i className="bi bi-linkedin text-5xl"></i>
                      <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0077b5] shadow-sm animate-pulse"></span>
                    </div>

                    <div className="flex-grow z-10 text-center sm:text-left">
                      <div className="flex flex-col">
                        <h6 className="text-xl md:text-2xl font-bold text-white mb-0.5 font-comfortaa">
                          Thabang Mposula
                        </h6>
                        <p className="text-[#0077b5] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                          Founder & Senior AI Engineer
                        </p>
                      </div>

                      <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                        <a
                          href="https://www.linkedin.com/in/thabang-mposula-iarxii/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-[#0077b5] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-white hover:text-[#0077b5] transition-all flex items-center gap-2 shadow-lg"
                        >
                          Profile <ExternalLink size={12} />
                        </a>
                        <a
                          href="https://www.linkedin.com/company/adaptivconcept-fl"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-white/5 border border-[#0077b5]/30 text-[#0077b5] text-[11px] font-bold uppercase tracking-wider hover:bg-[#0077b5]/10 transition-all flex items-center gap-2"
                        >
                          Company <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>

                    <div className="hidden sm:flex w-10 h-10 rounded-full bg-white/5 text-[#0077b5] items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <ChevronRight size={20} />
                    </div>
                  </motion.div>
                </div>

                {/* Github profile card */}
                <div className="mb-5">
                  <motion.div
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="group relative flex flex-col sm:flex-row items-center gap-6 p-4 md:p-6 rounded-2xl md:rounded-[24px] glass-theme border border-theme backdrop-blur-3xl hover:border-[#8b949e]/50 transition-all duration-500 max-w-lg w-full overflow-hidden mb-5"
                    style={{ backgroundColor: 'var(--glass-bg)' }}
                  >
                    {/* Github-branded accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#f0f6fc]/5 blur-[60px] -mr-10 -mt-10 group-hover:bg-[#58a6ff]/10 transition-all duration-700"></div>

                    <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-[#24292f] flex items-center justify-center text-white border border-white/10 overflow-hidden shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <i className="bi bi-github text-5xl"></i>
                      <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-[#24292f] shadow-sm animate-pulse"></span>
                    </div>

                    <div className="flex-grow z-10 text-center sm:text-left">
                      <div className="flex flex-col">
                        <h6 className="text-xl md:text-2xl font-bold text-white mb-0.5 font-comfortaa">
                          Thabang Mposula
                        </h6>
                        <p className="text-[#8b949e] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                          Fullstack Systems Developer
                        </p>
                      </div>

                      <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                        <a
                          href="https://github.com/iarxii"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-white text-[#24292f] text-[11px] font-bold uppercase tracking-wider hover:bg-[#f0f6fc] transition-all flex items-center gap-2 shadow-lg"
                        >
                          Repositories <ExternalLink size={12} />
                        </a>
                        <a
                          href="https://github.com/AdaptivConcept-NPC"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                          Organization <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>

                    <div className="hidden sm:flex w-10 h-10 rounded-full bg-white/5 text-white/50 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <ChevronRight size={20} />
                    </div>
                  </motion.div>
                </div>

                {/* Copyright */}
                <p className="text-low text-sm leading-relaxed mt-8 mx-auto md:mx-0 font-poppins font-medium opacity-80 mb-5">
                  Engineering high-performance solutions for technical
                  excellence. <br />
                  <span className="text-xs opacity-60">
                    © {new Date().getFullYear()} AdaptivConcept™ FL. All Rights
                    Reserved.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Socials & Action */}
          <div className="flex flex-col items-center md:items-end gap-10">
            <ProfilePersonas onPersonaHover={setHoveredPersona} />

            <div className="flex flex-col items-center md:items-end gap-6 text-center md:text-right">
              <div className="flex gap-4">
                {[
                  {
                    icon: <i className="bi bi-github text-xl"></i>,
                    href: "https://github.com/iarxii",
                    title: "GitHub",
                  },
                  {
                    icon: <i className="bi bi-envelope-at text-xl"></i>,
                    href: "mailto:contact@adaptivconcept.co.za",
                    title: "Email",
                  },
                  {
                    icon: <i className="bi bi-linkedin text-lg"></i>,
                    href: "https://www.linkedin.com/in/thabang-mposula-iarxii/",
                    title: "LinkedIn",
                  },
                  {
                    icon: <i className="bi bi-whatsapp text-xl"></i>,
                    href: "https://wa.me/#",
                    title: "WhatsApp",
                  },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-theme flex items-center justify-center text-low hover:bg-hover-bg hover:text-hover-text hover:border-hover-bg hover:-translate-y-1 transition-all duration-300 shadow-xl"
                    title={social.title}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <p className="text-high text-sm font-poppins italic max-w-[280px] border-r-2 border-adaptiv-orange pr-4 py-1 transition-all duration-500">
                "
                {hoveredPersona
                  ? personaMessages[hoveredPersona]
                  : defaultMessage}
                "
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-white:hover {
          color: white !important;
          transform: translateY(-3px);
        }
        .text-primary-accent {
          color: var(--primary);
        }
        .bg-primary-accent {
          background-color: var(--primary);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
