import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Rocket, Terminal, Cpu, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import routeMap from "../data/route_map.json";

const labsData = {
  "pyswissshef": {
    title: "PySwissShef Lab",
    subtitle: "Interactive Python & Shell Catalogue",
    description: "Experience the Swiss Knife of automation directly in your browser. This lab provides a sandboxed environment to explore, run, and modify the PySwissShef collection of scripts.",
    prerequisites: [
      { item: "Python 3.10+", status: "Virtual / WASM" },
      { item: "Modern Browser", status: "Required" },
      { item: "Shell Access", status: "WebContainer Supported" }
    ],
    features: [
      "Zero-config execution",
      "Interactive CLI interface",
      "Instant code sharing",
      "Sandboxed safety"
    ],
    stackblitzUrl: "https://stackblitz.com/~/github/iarxii/PySwissShef",
    replitUrl: "https://py-portfolio-lab--thabangmposula.replit.app",
    accentColor: "#f97316", // adaptiv-orange
    icon: Terminal
  },
  "aicodex": {
    title: "AICodex Lab",
    subtitle: "Agentic Orchestration & Reasoning",
    description: "Advanced agentic orchestration and real-time reasoning portal. Connected to LPU-speed inference for near-instant response cycles.",
    prerequisites: [
      { item: "React / Vite", status: "Modern Browser" },
      { item: "Agentic Access", status: "Token Required" },
      { item: "High-Speed Inference", status: "Groq Connected" }
    ],
    features: [
      "Real-time reasoning visualization",
      "Agentic tool orchestration",
      "LPU-speed Groq inference",
      "Persistent session context"
    ],
    portalUrl: routeMap.frontend_url,
    accentColor: "#a855f7", // purple-500
    icon: Cpu
  }
};

const LabDetail = () => {
  const { id } = useParams();
  const { themeColor } = useTheme();
  const lab = labsData[id];

  if (!lab) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-high mb-4">Lab Not Found</h2>
          <Link to="/projects" className="text-adaptiv-orange hover:underline">Back to Project Board</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-6 py-20 min-h-screen flex flex-col items-center"
      style={{ marginTop: "120px" }}
    >
      <div className="w-full max-w-4xl">
        <Link to="/projects" className="flex items-center gap-2 text-low hover:text-high transition-colors mb-12 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Board</span>
        </Link>

        {/* Hero Section */}
        <div className="glass-theme rounded-[40px] p-8 md:p-12 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full -mr-20 -mt-20" 
               style={{ backgroundColor: `${lab.accentColor}1A` }} />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
               <div className="p-3 rounded-2xl" style={{ backgroundColor: `${lab.accentColor}33`, color: lab.accentColor }}>
                 {lab.icon && <lab.icon size={32} />}
               </div>
               <span className="text-xs font-black tracking-widest uppercase" style={{ color: lab.accentColor }}>Experimental Lab</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-comfortaa font-bold text-high mb-4">
              {lab.title}
            </h1>
            <p className="text-xl text-low font-poppins mb-8">
              {lab.subtitle}
            </p>
            
            <p className="text-high/80 text-lg leading-relaxed mb-10 max-w-2xl">
              {lab.description}
            </p>

            <div className="flex flex-wrap gap-4">
              {lab.stackblitzUrl && (
                <a 
                  href={lab.stackblitzUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 px-6 py-4 rounded-[28px] text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl group"
                  style={{ backgroundColor: lab.accentColor, boxShadow: `0 20px 25px -5px ${lab.accentColor}4D` }}
                >
                  <div className="bg-white p-2 rounded-2xl shadow-sm flex items-center justify-center group-hover:rotate-6 transition-transform">
                    <img src="/media/brand-icons/StackBlitz.svg" alt="StackBlitz Icon" className="w-8 h-8 object-contain" />
                  </div>
                  <span>Tasting Room (StackBlitz)</span>
                </a>
              )}

              {lab.portalUrl && (
                <a 
                  href={lab.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 px-6 py-4 rounded-[28px] text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl group"
                  style={{ backgroundColor: lab.accentColor, boxShadow: `0 20px 25px -5px ${lab.accentColor}4D` }}
                >
                  <div className="bg-white p-2 rounded-2xl shadow-sm flex items-center justify-center group-hover:rotate-6 transition-transform">
                     {lab.icon && <lab.icon size={32} style={{ color: lab.accentColor }} />}
                  </div>
                  <span>Launch Agentic Portal</span>
                </a>
              )}

              {lab.replitUrl && (
                <a 
                  href={lab.replitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 px-6 py-4 rounded-[28px] bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all group"
                >
                  <div className="bg-white p-2 rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <img src="/media/brand-icons/Replit.svg" alt="Replit Icon" className="w-8 h-8 object-contain" />
                  </div>
                  <span>High-Heat Kitchen (Replit)</span>
                </a>
              )}

              {/* also add a disabled button that will be used in the future for Github Codespaces, Use "Coming Soon" as the text */}
              <button 
                disabled
                className="inline-flex items-center gap-4 px-6 py-4 rounded-[28px] bg-white/5 border border-white/10 text-white font-bold cursor-not-allowed transition-all"
              >
                <div className="bg-white/20 p-2 rounded-2xl shadow-sm flex items-center justify-center grayscale">
                  <img src="/media/brand-icons/githubcodespaces-original.svg" alt="Codespaces Icon" className="w-8 h-8 object-contain opacity-40" />
                </div>
                <div className="flex flex-col items-start leading-none gap-1">
                  <span className="text-lg opacity-40">Github Codespaces</span>
                  <span className="text-[10px] uppercase tracking-tighter font-black opacity-30">Coming Soon</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Prerequisites */}
          <div className="glass-theme rounded-[32px] p-8 border border-white/5">
            <h3 className="text-2xl font-bold text-high mb-6 flex items-center gap-3">
              <AlertCircle style={{ color: lab.accentColor }} /> Prerequisites
            </h3>
            <div className="space-y-4">
              {lab.prerequisites.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                  <span className="text-high font-medium">{p.item}</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 text-high">{p.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="glass-theme rounded-[32px] p-8 border border-white/5">
            <h3 className="text-2xl font-bold text-high mb-6 flex items-center gap-3">
              <CheckCircle2 className="text-green-400" /> Key Features
            </h3>
            <ul className="space-y-4">
              {lab.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-high">
                   <div className="w-1.5 h-1.5 rounded-full bg-adaptiv-orange" />
                   {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-12 glass-theme rounded-[32px] p-8 border border-white/5">
            <h3 className="text-2xl font-bold text-high mb-6 flex items-center gap-3">
              <Rocket className="text-adaptiv-orange" /> Getting Started
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-3">
                <span className="font-black text-2xl opacity-60 italic font-comfortaa" style={{ color: lab.accentColor }}>01.</span>
                <p className="text-sm text-high leading-relaxed">Click the <b>"Launch Lab Console"</b> button to open the WebContainer environment.</p>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-black text-2xl opacity-60 italic font-comfortaa" style={{ color: lab.accentColor }}>02.</span>
                <p className="text-sm text-high leading-relaxed">Wait for the Python environment to boot automatically (Powered by StackBlitz).</p>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-black text-2xl opacity-60 italic font-comfortaa" style={{ color: lab.accentColor }}>03.</span>
                <p className="text-sm text-high leading-relaxed">Follow the instructions in the terminal to browse and run your first recipe.</p>
              </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LabDetail;
