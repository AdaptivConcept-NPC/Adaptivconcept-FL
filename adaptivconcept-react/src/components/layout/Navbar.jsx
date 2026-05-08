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
        >
          {/* <span className="material-icons-round text-adaptiv-orange group-hover:scale-110 transition-transform">
            auto_awesome
          </span> */}
          <img
            src="media/Adaptiv Media Concept Logo.png"
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
              style={{ color: "var(--text-h)" }}
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
          className="lg:hidden text-high p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Links */}
        <div
          className={`
          ${isMenuOpen ? "flex" : "hidden"} 
          lg:flex flex-col lg:flex-row items-center absolute lg:static top-full left-0 w-full lg:w-auto 
          transition-colors duration-500
          lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none 
          p-8 lg:p-0 gap-8 lg:gap-10 border-b lg:border-none border-theme
          no-scrollbar overflow-x-auto
        `}
          style={{
            backgroundColor:
              isMenuOpen && window.innerWidth < 1024
                ? themeColor.washType === "light"
                  ? "rgba(245, 245, 247, 1)"
                  : "rgba(10, 10, 10, 0.98)"
                : "transparent",
          }}
        >
          <ul className="flex flex-col lg:flex-row items-center gap-8 m-0 p-0">
            <li>
              {/* home */}
              <Link
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-high ${isActive("/") ? "font-bold" : ""}`}
                style={{
                  color: isActive("/") ? "var(--text-h)" : "var(--text)",
                }}
                to="/"
                onClick={() => setIsMenuOpen(false)}
              >
                {isMenuOpen ? (
                  <div className="flex items-center gap-4 w-full">
                    <Home size={24} />
                    <span className="text-lg font-semibold">Home</span>
                  </div>
                ) : (
                  <>
                    <Home size={18} /> <p className="truncate">Home</p>
                  </>
                )}
              </Link>
            </li>
            {isMenuOpen ? (
              <div className="w-1/3 mx-auto h-px bg-white my-2" />
            ) : (
              <span className="my-auto opacity-30">|</span>
            )}
            {/* projects */}
            <li>
              <Link
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-high ${isActive("/projects") ? "font-bold" : ""}`}
                style={{
                  color: isActive("/projects")
                    ? "var(--text-h)"
                    : "var(--text)",
                }}
                to="/projects"
                onClick={() => setIsMenuOpen(false)}
              >
                {isMenuOpen ? (
                  <div className="flex items-center gap-4 w-full">
                    <FolderKanban size={24} />
                    <span className="text-lg font-semibold">Project Board</span>
                  </div>
                ) : (
                  <>
                    <FolderKanban size={18} />{" "}
                    <p className="truncate">Project Board</p>
                  </>
                )}
              </Link>
            </li>
            {isMenuOpen ? (
              <div className="w-1/3 mx-auto h-px bg-white my-2" />
            ) : (
              <span className="my-auto opacity-30">|</span>
            )}
            {/* blog */}
            <li>
              <Link
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-high ${isActive("/blog") ? "font-bold" : ""}`}
                style={{
                  color: isActive("/blog") ? "var(--text-h)" : "var(--text)",
                }}
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
              >
                {isMenuOpen ? (
                  <div className="flex items-center gap-4 w-full">
                    <Newspaper size={24} />
                    <span className="text-lg font-semibold">Blog</span>
                  </div>
                ) : (
                  <>
                    <Newspaper size={18} /> <p className="truncate">Blog</p>
                  </>
                )}
              </Link>
            </li>
            {isMenuOpen ? (
              <div className="w-1/3 mx-auto h-px bg-white my-2" />
            ) : (
              <span className="my-auto opacity-30">|</span>
            )}
            {/* arcade */}
            <li>
              <Link
                className={`flex items-center gap-2 text-sm font-medium transition-all hover:text-high px-3 py-1.5 rounded-xl border border-transparent hover:border-glass-border hover:bg-white/5 ${isActive("/arcade") ? "font-bold text-high bg-white/10 border-glass-border shadow-lg shadow-adaptiv-orange/10" : ""}`}
                style={{
                  color: isActive("/arcade") ? "var(--text-h)" : "var(--text)",
                }}
                to="/arcade"
                onClick={() => setIsMenuOpen(false)}
              >
                {isMenuOpen ? (
                  <div className="flex items-center gap-4 w-full">
                    <span className="p-2 rounded-xl bg-adaptiv-orange/20 text-adaptiv-orange flex items-center justify-center">
                      <Gamepad2 size={24} />
                    </span>
                    <span className="text-lg font-semibold">Dev Arcade</span>
                  </div>
                ) : (
                  <>
                    <span className="p-1.5 rounded-lg bg-adaptiv-orange/20 text-adaptiv-orange flex items-center justify-center">
                      <Gamepad2 size={18} />
                    </span>
                    <p className="truncate">Dev Arcade</p>
                  </>
                )}
              </Link>
            </li>
            {isMenuOpen ? (
              <div className="w-1/3 mx-auto h-px bg-white my-2" />
            ) : (
              <span className="my-auto opacity-30">|</span>
            )}
            {/* contact */}
            <li>
              <Link
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-high ${isActive("/contact") ? "font-bold" : ""}`}
                style={{
                  color: isActive("/contact") ? "var(--text-h)" : "var(--text)",
                }}
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
              >
                {isMenuOpen ? (
                  <div className="flex items-center gap-4 w-full">
                    <Mail size={24} />
                    <span className="text-lg font-semibold">Contact</span>
                  </div>
                ) : (
                  <>
                    <Mail size={18} /> <p className="truncate">Contact</p>
                  </>
                )}
              </Link>
            </li>
          </ul>

          {isMenuOpen ? (
            <div className="w-1/3 mx-auto h-px bg-white my-4" />
          ) : (
            <span className="my-auto opacity-30">|</span>
          )}

          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* resume button */}
            <Link
              to="/resume"
              onClick={() => setIsMenuOpen(false)}
              className="px-5 py-2.5 rounded-xl border-2 font-medium btn-adaptive-hover transition-all flex items-center gap-2"
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
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                display: "flex",
                position: "relative",
              }}
            >
              {/* projects button */}
              <Link
                to="/contact"

                className="px-8 py-3.5 rounded-2xl font-black btn-adaptive-hover transition-all lg:ml-2 cta-shimmer speech-bubble-cta me-4"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  backgroundColor: themeColor.value,
                  color: themeColor.washType === "light" ? "#111111" : "#fff",
                  fontSize: "1.1rem",
                  "--cta-color": themeColor.value,
                  position: "relative",
                }}
              >
                {/* Shimmer Layer inside for overflow containment */}
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
