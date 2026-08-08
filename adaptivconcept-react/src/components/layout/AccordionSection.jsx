import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

/**
 * AccordionSection - A reusable collapsible section for the GlobalFAB menu
 * @param {ReactNode} title - Section title
 * @param {ReactNode} icon - Leading icon node
 * @param {boolean} defaultOpen - Whether the section starts expanded
 * @param {string} accentColor - Theme color for active styling
 * @param {ReactNode} children - Body content
 */
const AccordionSection = ({
  title,
  icon,
  defaultOpen = false,
  accentColor,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className="overflow-hidden rounded-xl border border-white/10"
      style={{ backgroundColor: "var(--glass-bg)" }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
      >
        <span className="flex items-center gap-2.5 text-high">
          {icon && (
            <span style={{ color: accentColor }}>{icon}</span>
          )}
          <span className="font-bold text-sm">{title}</span>
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 0 : 0 }}
          className="text-low"
        >
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccordionSection;
