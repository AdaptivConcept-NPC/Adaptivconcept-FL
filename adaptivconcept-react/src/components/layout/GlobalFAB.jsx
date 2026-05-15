import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Bot, X, Plus, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * GlobalFAB - A premium, theme-aware Floating Action Button
 * @param {boolean} show - Toggle visibility
 * @param {Array} customActions - Array of action objects { id, icon, label, onClick, color }
 */
const GlobalFAB = ({ show = true, customActions = [] }) => {
  const { themeColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (!show) return null;

  const defaultActions = [
    { 
      id: "agent", 
      icon: Bot, 
      label: "AI Agent (Codex)", 
      color: "#bc13fe",
      onClick: () => console.log("AI Agent clicked")
    },
    { 
      id: "chat", 
      icon: MessageSquare, 
      label: "Live Chat", 
      color: "#00f2ff",
      onClick: () => console.log("Chat clicked")
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
      }
    },
  ];

  const actions = customActions.length > 0 ? customActions : defaultActions;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      {/* Expanded Actions Menu */}
      <div className="flex flex-col items-end gap-3 mb-2 pointer-events-auto">
        <AnimatePresence>
          {isOpen && actions.map((action, idx) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20, scale: 0.8, filter: "blur(10px)" }}
              transition={{ 
                type: "spring",
                damping: 15,
                stiffness: 300,
                delay: (actions.length - 1 - idx) * 0.05 
              }}
              className="flex items-center gap-4 group"
            >
              {/* Tooltip Label */}
              <motion.span 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/80 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md border border-white/10 shadow-xl pointer-events-none"
              >
                {action.label}
              </motion.span>

              {/* Action Button */}
              <button 
                className="w-12 h-12 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-90 border border-white/20 group-hover:border-white/40"
                style={{ 
                    backgroundColor: action.color || themeColor.value,
                    boxShadow: `0 10px 20px -5px ${action.color || themeColor.value}66`
                }}
                onClick={() => {
                  action.onClick?.();
                  setIsOpen(false);
                }}
              >
                <action.icon size={20} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Trigger Button */}
      <div className="relative pointer-events-auto">
        {/* Subtle Attention Puller (Ring Pulse) */}
        {!isOpen && (
            <motion.div
              animate={{
                scale: [1, 1.4, 1.8],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: themeColor.value }}
            />
        )}

        {/* Floating Glow */}
        <motion.div
           animate={{
             boxShadow: [
               `0 0 20px ${themeColor.value}44`,
               `0 0 40px ${themeColor.value}88`,
               `0 0 20px ${themeColor.value}44`,
             ]
           }}
           transition={{ duration: 4, repeat: Infinity }}
           className="absolute inset-0 rounded-full"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white z-50 overflow-hidden border border-white/20"
          style={{ backgroundColor: themeColor.value }}
        >
          {/* Main Icon Animation */}
          <motion.div
            animate={{ 
              rotate: isOpen ? 135 : 0,
              scale: isOpen ? 0.8 : 1 
            }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="relative z-10"
          >
            {isOpen ? <Plus size={32} /> : <Sparkles size={30} />}
          </motion.div>
          
          {/* Internal Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        </motion.button>
      </div>
    </div>
  );
};

export default GlobalFAB;
