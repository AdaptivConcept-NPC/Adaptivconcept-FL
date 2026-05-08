import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Accessibility, Settings2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const SettingsModal = ({ isOpen, onClose }) => {
  const {
    isInstantReadabilityEnabled,
    setIsInstantReadabilityEnabled,
    themeColor,
  } = useTheme();

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
