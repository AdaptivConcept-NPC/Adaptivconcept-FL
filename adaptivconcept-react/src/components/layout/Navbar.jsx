import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FolderKanban,
  Download,
  Mail,
  Menu,
  X,
  Handshake,
} from "lucide-react";
import FLFontCarousel from "../FLFontCarousel";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-black/40 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
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
            className="navbar-logo"
          />
          <div className="flex items-center">
            <span className="text-xl font-comfortaa font-bold text-white tracking-tight">
              AdaptivConcept
              <div
                style={{
                  position: "absolute",
                  fontSize: "12px",
                  marginTop: "-12px",
                  marginLeft: "2px",
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
          className="lg:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Links */}
        <div
          className={`
          ${isMenuOpen ? "flex" : "hidden"} 
          lg:flex flex-col lg:flex-row items-center absolute lg:static top-full left-0 w-full lg:w-auto 
          bg-black/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none 
          p-8 lg:p-0 gap-8 lg:gap-10 border-b lg:border-none border-white/10
        `}
        >
          <ul className="flex flex-col lg:flex-row items-center gap-8 m-0 p-0">
            <li>
              <Link
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${isActive("/") ? "text-white font-bold" : "text-gray-400"}`}
                to="/"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} /> Home
              </Link>
            </li>
            <li>
              <Link
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${isActive("/projects") ? "text-white font-bold" : "text-gray-400"}`}
                to="/projects"
                onClick={() => setIsMenuOpen(false)}
              >
                <FolderKanban size={18} /> Project Board
              </Link>
            </li>
          </ul>

          <div className="flex flex-col lg:flex-row items-center gap-3">
            <a
              href="/cv-public.pdf"
              className="px-5 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <Download size={16} /> Open Résumé
            </a>
            <button className="px-5 py-2.5 rounded-xl border-2 border-adaptiv-white text-white font-medium hover:bg-adaptiv-orange transition-all flex items-center gap-2">
              <Mail size={16} /> Request Detailed CV
            </button>
            <Link
              to="/projects"
              className="px-6 py-2.5 rounded-xl bg-adaptiv-orange text-white font-bold hover:bg-white hover:text-adaptiv-orange transition-all lg:ml-2"
              onClick={() => setIsMenuOpen(false)}
              style={{ display: "flex", gap: 6, alignItems: "center" }}
            >
              Hire Me
              <Handshake size={26} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
