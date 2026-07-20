import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FolderKanban,
  Newspaper,
  FileUser,
  Mail,
  Menu,
  X,
  Handshake,
  Palette,
  Gamepad2,
  Minus,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import FLFontCarousel from "../FLFontCarousel";
import UISettingsButton from "./UISettingsButton";
import SettingsModal from "./SettingsModal";
import "./Navbar.css";
import "../../pages/GamingArcade.css";

const Navbar = () => {
  const { themeColor, nextColor } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b px-6 py-4"
        style={{
          backgroundColor: `var(--glass-bg)`,
          backdropFilter: "blur(16px)",
          borderBottomColor: `var(--glass-border)`,
        }}
      >
        <div className="container-fluid mx-auto flex items-center justify-between">
          {/* Brand */}
          <Link
            className="flex items-center gap-2 group"
            to="/"
            onClick={() => setIsMenuOpen(false)} 
            style={{ scale: "0.7", transition: "transform 0.3s ease", marginLeft: "-40px" }}
          >
            {/* <span className="material-icons-round text-adaptiv-orange group-hover:scale-110 transition-transform">
            auto_awesome
          </span> */}
            <img
              src="/media/Adaptiv Media Concept Logo.png"
              alt="Adaptivconcept FL Logo"
              className="navbar-logo cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                nextColor();
              }}
              title="Click to cycle theme color"
            />
            <div className="flex items-center">
              <span
                className="text-xl font-comfortaa font-bold tracking-tight relative"
                style={{ color: "var(--text-h)", marginRight: "4px" }}
              >
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
              </span>
              <FLFontCarousel size="text-2xl" className="ml-2 w-auto min-h-0" />
            </div>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="xl:hidden text-high p-2 transition-transform active:scale-95"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Navigation Links Container */}
          <div
            className={`
              ${isMenuOpen ? "flex" : "hidden"} 
              xl:flex flex-col xl:flex-row items-center absolute xl:static top-full left-0 w-full xl:w-auto 
              transition-all duration-500
              xl:bg-transparent backdrop-blur-3xl xl:backdrop-blur-none 
              p-8 xl:p-0 gap-8 xl:gap-10 border-b xl:border-none border-theme
              no-scrollbar overflow-x-auto z-50
            `}
            style={{
              backgroundColor:
                isMenuOpen && typeof window !== "undefined" && window.innerWidth < 1280
                  ? themeColor.washType === "light"
                    ? "rgba(245, 245, 247, 1)"
                    : "rgba(10, 10, 10, 0.98)"
                  : "transparent",
            }}
          >
            {/* Main Links */}
            <ul className="flex flex-col xl:flex-row items-center gap-8 m-0 p-0 w-full xl:w-auto">
              {[
                { path: "/", label: "Home", icon: Home },
                { path: "/projects", label: "Project Board", icon: FolderKanban },
                { path: "/blog", label: "Blog", icon: Newspaper },
                { path: "/contact", label: "Contact", icon: Mail },
                { path: "/arcade", label: "Dev Arcade", icon: Gamepad2, isArcade: true },
              ].map((link, index) => (
                <React.Fragment key={link.path}>
                  <li>
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-2 text-sm font-medium transition-all hover:text-high ${
                        link.isArcade 
                          ? `px-3 py-1.5 rounded-xl border border-transparent hover:border-glass-border hover:bg-white/5 ${isActive(link.path) ? "font-bold text-high bg-white/10 border-glass-border shadow-lg shadow-adaptiv-orange/10" : ""}`
                          : isActive(link.path) ? "font-bold" : ""
                      }`}
                      style={{
                        color: isActive(link.path) ? "var(--text-h)" : "var(--text)",
                      }}
                    >
                      {isMenuOpen ? (
                        <div className="flex items-center gap-4 w-full">
                          {link.isArcade ? (
                            <span className="p-2 rounded-xl bg-adaptiv-orange/20 text-adaptiv-orange flex items-center justify-center">
                              <link.icon size={24} />
                            </span>
                          ) : (
                            <link.icon size={24} />
                          )}
                          <span className="text-lg font-semibold">{link.label}</span>
                        </div>
                      ) : (
                        <>
                          {link.isArcade ? (
                            <span className="p-1.5 rounded-lg bg-adaptiv-orange/20 text-adaptiv-orange flex items-center justify-center">
                              <link.icon size={18} />
                            </span>
                          ) : (
                            <link.icon size={18} />
                          )}
                          <p className="truncate">{link.label}</p>
                        </>
                      )}
                    </Link>
                  </li>
                  {index < 4 && (
                    isMenuOpen ? (
                      <div className="w-1/3 mx-auto h-px bg-white/10 my-1" />
                    ) : (
                      <span className="my-auto opacity-30 hidden xl:block">|</span>
                    )
                  )}
                </React.Fragment>
              ))}
            </ul>

            {/* Desktop Divider between links and buttons */}
            {!isMenuOpen && <span className="my-auto opacity-30 hidden xl:block">|</span>}
            {isMenuOpen && <div className="w-1/3 mx-auto h-px bg-white/10 my-1 xl:hidden" />}

            {/* Actions (Resume & Hire Me) */}
            <div className="flex flex-col xl:flex-row items-center gap-3 w-full xl:w-auto">
              <Link
                to="/resume"
                onClick={() => setIsMenuOpen(false)}
                className="px-5 py-2.5 rounded-xl border-2 font-medium btn-adaptive-hover transition-all flex items-center gap-2 w-full xl:w-auto justify-center"
                style={{
                  borderColor: "var(--glass-border)",
                  color: "var(--text-h)",
                }}
              >
                {isMenuOpen ? (
                  <div className="flex items-center gap-4 w-full px-2">
                    <FileUser size={24} />
                    <span className="text-lg font-semibold">Résumé</span>
                  </div>
                ) : (
                  <>
                    <FileUser size={16} /> <p className="truncate">Résumé</p>
                  </>
                )}
              </Link>

              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  filter: [
                    `drop-shadow(0 0 0px ${themeColor.value}00)`,
                    `drop-shadow(0 0 12px ${themeColor.value}66)`,
                    `drop-shadow(0 0 0px ${themeColor.value}00)`,
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-full xl:w-auto flex justify-center"
              >
                <Link
                  to="/contact"
                  className="px-8 py-3.5 rounded-2xl font-black btn-adaptive-hover transition-all xl:ml-2 cta-shimmer speech-bubble-cta w-full xl:w-auto flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    gap: 10,
                    backgroundColor: themeColor.value,
                    color: themeColor.washType === "light" ? "#111111" : "#fff",
                    fontSize: "1.1rem",
                    "--cta-color": themeColor.value,
                    position: "relative",
                  }}
                >
                  <div className="shimmer-layer"></div>
                  {isMenuOpen ? (
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-black">Hire Me</span>
                      <Handshake size={32} className="relative z-10" />
                    </div>
                  ) : (
                    <>
                      <p className="truncate relative z-10">Hire Me</p>
                      <Handshake size={28} className="relative z-10" />
                    </>
                  )}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Hanging UI Settings Button */}
        <UISettingsButton
          onClick={() => setIsSettingsOpen(true)}
          className="absolute top-full right-8 shadow-lg shadow-black/20"
        />
      </nav>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default Navbar;
