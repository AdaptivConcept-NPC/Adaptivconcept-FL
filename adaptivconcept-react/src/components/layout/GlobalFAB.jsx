import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Bot, X, ChevronRight, MessageCircle, Zap, Settings2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import AccordionSection from "./AccordionSection";
import AgentChatSection from "./AgentChatSection";
import "./GlobalFAB.css";

const FAB_PRIMARY = "#fd3b12";

/**
 * GlobalFAB - A premium, theme-aware Floating Action Button
 * Collapsed state shows the Spirit Bird logo; expanded state reveals
 * an accordion menu with an Agent Chat section, Quick Actions, and Settings.
 * @param {boolean} show - Toggle visibility
 * @param {Array} customActions - Array of action objects { id, icon, label, onClick, color }
 * @param {Function} onOpenSettings - Opens the UI Settings modal
 */
const GlobalFAB = ({ show = true, customActions = [], onOpenSettings }) => {
  const { themeColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  if (!show) return null;

  const accentColor = themeColor.value;

  // Only one accordion section is expanded at a time.
  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const defaultActions = [
    {
      id: "lab",
      icon: Bot,
      label: "Open AICodex Lab",
      color: "#bc13fe",
      onClick: () => {
        window.location.href = "/labs/aicodex";
      },
    },
    {
      id: "contact",
      icon: Mail,
      label: "Contact Me",
      color: themeColor.value,
      onClick: () => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.href = "/#contact";
        }
      },
    },
  ];

  const actions = customActions.length > 0 ? customActions : defaultActions;

  const handleAction = (action) => {
    action.onClick?.();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      {/* Expanded Accordion Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 24, scale: 0.9, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="w-[320px] max-w-[calc(100vw-4rem)] pointer-events-auto glass-panel rounded-2xl overflow-hidden fab-white-panel"
            style={{
              borderColor: "var(--theme-color)",
              backgroundColor: "#fff",
            }}
            role="region"
            aria-label="Assistant menu"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="flex items-center gap-2.5">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}33`, color: accentColor }}
                >
                  {/* <MessageCircle size={18} /> */}
                  <img
                    src="/media/aicodex-spirit-bird.svg"
                    alt="Spirit Bird Logo"
                    className="w-[34px] h-[34px] p-1.5 object-contain"
                    draggable={false}
                  />
                </span>
                <span className="text-high font-bold text-sm">Spirit Bird Assistant</span>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="p-1.5 rounded-full text-low hover:text-high hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar">
              {/* 1. Agent Chat Section */}
              <AccordionSection
                title="Spirit Book Chat"
                icon={<Bot size={16} />}
                accentColor={accentColor}
                className="fab-accordion"
                isOpen={openSection === "chat"}
                onToggle={() => toggleSection("chat")}
              >
                <AgentChatSection
                  accentColor={accentColor}
                  onMessage={(msg) => console.log("Outbound message:", msg)}
                />
              </AccordionSection>

              {/* 2. Quick Actions Section */}
              <AccordionSection
                title="Quick Actions"
                icon={<Zap size={16} />}
                accentColor={accentColor}
                className="fab-accordion"
                isOpen={openSection === "actions"}
                onToggle={() => toggleSection("actions")}
              >
                <div className="space-y-2">
                  {actions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleAction(action)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-105 icon-badge"
                        style={{
                          backgroundColor: action.color || accentColor,
                          boxShadow: `0 4px 10px -4px ${action.color || accentColor}66`,
                        }}
                      >
                        <action.icon size={16} />
                      </span>
                      <span className="flex-1 text-sm font-bold text-high">{action.label}</span>
                      <ChevronRight
                        size={14}
                        className="text-low opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </button>
                  ))}
                </div>
              </AccordionSection>

              {/* 3. Settings / Preferences Section */}
              <AccordionSection
                title="Settings"
                icon={<Settings2 size={16} />}
                accentColor={accentColor}
                className="fab-accordion"
                isOpen={openSection === "settings"}
                onToggle={() => toggleSection("settings")}
              >
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenSettings?.();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors bg-white/5"
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${accentColor}33`, color: accentColor }}
                    >
                      <Settings2 size={15} />
                    </span>
                    <span className="flex-1 text-left">
                      <span className="block text-sm font-bold text-high">UI Settings</span>
                      <span className="block text-[10px] text-low uppercase tracking-widest">
                        Open system settings
                      </span>
                    </span>
                    <ChevronRight size={14} className="text-low" />
                  </button>

                  <button
                    type="button"
                    disabled
                    className="w-full flex items-center gap-3 p-3 rounded-xl opacity-40 cursor-not-allowed bg-white/5"
                  >
                    <span
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0"
                    >
                      <Settings2 size={15} />
                    </span>
                    <span className="flex-1 text-left">
                      <span className="block text-sm font-bold text-high">Agent Config</span>
                      <span className="block text-[10px] text-low uppercase tracking-wider">
                        Coming soon
                      </span>
                    </span>
                  </button>
                </div>
              </AccordionSection>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <div className="relative pointer-events-auto">
        {/* Subtle Attention Puller (Ring Pulse) */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 2.2],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: accentColor, opacity: 0 }}
          />
        )}

        {/* Floating Glow */}
        <motion.div
          animate={{
            boxShadow: [
              `0 0 20px ${accentColor}44`,
              `0 0 40px ${accentColor}88`,
              `0 0 20px ${accentColor}44`,
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 rounded-full"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close assistant menu" : "Open assistant menu"}
          className="relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-50 overflow-hidden"
          style={{ backgroundColor: "#ffffff", border: `2px solid ${FAB_PRIMARY}` }}
        >
          {/* Main Icon Animation */}
          <motion.div
            animate={{
              rotate: isOpen ? 135 : 0,
              scale: isOpen ? 0.8 : 1,
            }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="relative z-10"
            style={{ color: FAB_PRIMARY }}
          >
            {isOpen ? (
              <X size={32} />
            ) : (
              <img
                src="/media/aicodex-spirit-bird.svg"
                alt="Spirit Bird Logo"
                className="w-[34px] h-[34px] object-contain"
                draggable={false}
              />
            )}
          </motion.div>

          {/* Internal Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        </motion.button>
      </div>
    </div>
  );
};

export default GlobalFAB;