import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Eye,
  Accessibility,
  Settings2,
  Sparkles,
  ScanLine,
  Palette,
  RotateCcw,
  Gauge,
  Layers,
  Zap,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const SettingsModal = ({ isOpen, onClose }) => {
  const {
    isInstantReadabilityEnabled,
    setIsInstantReadabilityEnabled,
    themeColor,
    isP5AnimatedEnabled,
    setIsP5AnimatedEnabled,
    isRetroDitherEnabled,
    setIsRetroDitherEnabled,
    retroDitherStrength,
    setRetroDitherStrength,
    retroDitherPixelSize,
    setRetroDitherPixelSize,
    retroDitherScanlines,
    setRetroDitherScanlines,
    retroDitherClickWave,
    setRetroDitherClickWave,
    resetRetroDitherSettings,
    isGlitchEnabled,
    setIsGlitchEnabled,
    glitchIntensity,
    setGlitchIntensity,
    glitchRotation,
    setGlitchRotation,
    resetGlitchSettings,
    nextColor,
  } = useTheme();
  const [ditherFps, setDitherFps] = useState(0);

  useEffect(() => {
    const handleFpsUpdate = (event) => setDitherFps(event.detail);
    window.addEventListener("retro-dither-fps", handleFpsUpdate);
    return () => window.removeEventListener("retro-dither-fps", handleFpsUpdate);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg glass-panel overflow-hidden rounded-3xl"
            style={{
              borderColor: "var(--glass-border)",
              backgroundColor: "var(--glass-bg)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-xl"
                  style={{
                    backgroundColor: `${themeColor.value}33`,
                    color: themeColor.value,
                  }}
                >
                  <Settings2 size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-high">System Settings</h2>
                  <p className="text-xs text-low">Personalize your experience</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-low hover:text-high"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
              {/* Accessibility Section */}
              <section>
                <div className="flex items-center gap-2 mb-4 opacity-60">
                  <Accessibility size={16} />
                  <h3 className="text-xs font-black uppercase tracking-widest">
                    Accessibility
                  </h3>
                </div>

                <div className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setIsInstantReadabilityEnabled(!isInstantReadabilityEnabled)}>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white/5 text-mid group-hover:text-high transition-colors">
                      <Eye size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-high">Instant Readability</p>
                      <p className="text-xs text-low">
                        Always show glass panel details without hovering
                      </p>
                    </div>
                  </div>

                  <button
                    className="relative w-12 h-6 rounded-full transition-colors duration-300 pointer-events-none"
                    style={{
                      backgroundColor: isInstantReadabilityEnabled
                        ? themeColor.value
                        : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <motion.div
                      animate={{ x: isInstantReadabilityEnabled ? 26 : 4 }}
                      className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                    />
                  </button>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4 opacity-60">
                  <Palette size={16} />
                  <h3 className="text-xs font-black uppercase tracking-widest">
                    Theme
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={nextColor}
                  className="glass-card w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-4 text-left">
                    <span
                      className="w-10 h-10 border-2 border-white/30"
                      style={{ backgroundColor: themeColor.value }}
                    />
                    <span>
                      <span className="block font-bold text-high">{themeColor.name}</span>
                      <span className="block text-xs text-low">Cycle to the next color theme</span>
                    </span>
                  </span>
                  <Palette size={20} style={{ color: themeColor.value }} />
                </button>
              </section>

              {/* P5 Animation Layer */}
              <section>
                <div className="flex items-center gap-2 mb-4 opacity-60">
                  <Layers size={16} />
                  <h3 className="text-xs font-black uppercase tracking-widest">
                    P5 Animation Layer
                  </h3>
                </div>

                <div className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setIsP5AnimatedEnabled(!isP5AnimatedEnabled)}>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white/5 text-mid group-hover:text-high transition-colors">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-high">Geometric Background FX</p>
                      <p className="text-xs text-low">
                        Animated geometric particle overlay behind the site
                      </p>
                    </div>
                  </div>

                  <button
                    className="relative w-12 h-6 rounded-full transition-colors duration-300 pointer-events-none"
                    style={{
                      backgroundColor: isP5AnimatedEnabled
                        ? themeColor.value
                        : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <motion.div
                      animate={{ x: isP5AnimatedEnabled ? 26 : 4 }}
                      className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                    />
                  </button>
                </div>
              </section>

              {/* Canvas UI Effects Section */}
              <section>
                <div className="flex items-center gap-2 mb-4 opacity-60">
                  <Sparkles size={16} />
                  <h3 className="text-xs font-black uppercase tracking-widest">
                    Canvas UI Effects
                  </h3>
                </div>

                <div className="glass-card p-4 space-y-4 mb-4">
                  <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors" onClick={(e) => { setIsGlitchEnabled(!isGlitchEnabled); e.stopPropagation(); }}>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-white/5 text-mid group-hover:text-high transition-colors">
                        <Zap size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-high">Hero Glitch</p>
                        <p className="text-xs text-low">
                          RGB-split glitch bursts on the hero headline
                        </p>
                      </div>
                    </div>

                    <button
                      className="relative w-12 h-6 rounded-full transition-colors duration-300 pointer-events-none"
                      style={{
                        backgroundColor: isGlitchEnabled
                          ? themeColor.value
                          : "rgba(255,255,255,0.1)",
                      }}
                    >
                      <motion.div
                        animate={{ x: isGlitchEnabled ? 26 : 4 }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                      />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-low">
                      <span>Burst strength</span>
                      <span>{glitchIntensity.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={glitchIntensity}
                      onChange={(e) => setGlitchIntensity(Number(e.target.value))}
                      className="w-full accent-[var(--theme-color)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-low">
                      <span>Rotation</span>
                      <span>{glitchRotation}°</span>
                    </label>
                    <input
                      type="range"
                      min="-80"
                      max="0"
                      step="1"
                      value={glitchRotation}
                      onChange={(e) => setGlitchRotation(Number(e.target.value))}
                      className="w-full accent-[var(--theme-color)]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={resetGlitchSettings}
                    className="w-full flex items-center justify-center gap-2 border border-theme py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-high hover:bg-white/10 transition-colors"
                  >
                    <RotateCcw size={15} /> Reset effect defaults
                  </button>
                </div>

                <div className="glass-card p-4 space-y-4">
                  <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setIsRetroDitherEnabled(!isRetroDitherEnabled)}>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-white/5 text-mid group-hover:text-high transition-colors">
                        <ScanLine size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-high">Retro Dither Overlay</p>
                        <p className="text-xs text-low">
                          Blend a retro pixel lens with the background motion
                        </p>
                      </div>
                    </div>

                    <button
                      className="relative w-12 h-6 rounded-full transition-colors duration-300 pointer-events-none"
                      style={{
                        backgroundColor: isRetroDitherEnabled ? themeColor.value : "rgba(255,255,255,0.1)",
                      }}
                    >
                      <motion.div
                        animate={{ x: isRetroDitherEnabled ? 26 : 4 }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-y border-white/10 py-3">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-low">
                      <Gauge size={15} /> Render rate
                    </span>
                    <span className="font-mono text-sm text-high">
                      {isRetroDitherEnabled ? `${ditherFps} FPS` : "Paused"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-low">
                      <span>Strength</span>
                      <span>{retroDitherStrength.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={retroDitherStrength}
                      onChange={(e) => setRetroDitherStrength(Number(e.target.value))}
                      className="w-full accent-[var(--theme-color)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-low">
                      <span>Pixel Size</span>
                      <span>{retroDitherPixelSize.toFixed(1)}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      step="0.5"
                      value={retroDitherPixelSize}
                      onChange={(e) => setRetroDitherPixelSize(Number(e.target.value))}
                      className="w-full accent-[var(--theme-color)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-low">
                      <span>Scanlines</span>
                      <span>{retroDitherScanlines.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={retroDitherScanlines}
                      onChange={(e) => setRetroDitherScanlines(Number(e.target.value))}
                      className="w-full accent-[var(--theme-color)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-low">
                      <span>Click Wave</span>
                      <span>{retroDitherClickWave.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={retroDitherClickWave}
                      onChange={(e) => setRetroDitherClickWave(Number(e.target.value))}
                      className="w-full accent-[var(--theme-color)]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={resetRetroDitherSettings}
                    className="w-full flex items-center justify-center gap-2 border border-theme py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-high hover:bg-white/10 transition-colors"
                  >
                    <RotateCcw size={15} /> Reset effect defaults
                  </button>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 bg-black/20 text-center">
              <p className="text-[10px] text-low uppercase tracking-[0.2em]">
                Settings are saved automatically to your device
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
