import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Rocket, Terminal, Cpu, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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
    stackblitzUrl: "https://stackblitz.com/github/iarxii/PySwissShef",
    accentColor: "#f97316" // adaptiv-orange
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-adaptiv-orange/10 blur-[100px] rounded-full -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
               <div className="p-3 rounded-2xl bg-adaptiv-orange/20 text-adaptiv-orange">
                 <Terminal size={32} />
               </div>
               <span className="text-xs font-black tracking-widest uppercase text-adaptiv-orange">Experimental Lab</span>
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

            <a 
              href={lab.stackblitzUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-adaptiv-orange text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-adaptiv-orange/30"
            >
              Launch Lab Console <ExternalLink size={20} />
            </a>
          </div>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Prerequisites */}
          <div className="glass-theme rounded-[32px] p-8 border border-white/5">
            <h3 className="text-2xl font-bold text-high mb-6 flex items-center gap-3">
              <AlertCircle className="text-adaptiv-orange" /> Prerequisites
            </h3>
            <div className="space-y-4">
              {lab.prerequisites.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                  <span className="text-high font-medium">{p.item}</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 text-low">{p.status}</span>
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
                <li key={i} className="flex items-center gap-3 text-low">
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
                <span className="text-adaptiv-orange font-black text-2xl opacity-20 italic font-comfortaa">01.</span>
                <p className="text-sm text-low">Click the <b>"Launch Lab Console"</b> button to open the WebContainer environment.</p>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-adaptiv-orange font-black text-2xl opacity-20 italic font-comfortaa">02.</span>
                <p className="text-sm text-low">Wait for the Python environment to boot automatically (Powered by StackBlitz).</p>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-adaptiv-orange font-black text-2xl opacity-20 italic font-comfortaa">03.</span>
                <p className="text-sm text-low">Follow the instructions in the terminal to browse and run your first recipe.</p>
              </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LabDetail;
