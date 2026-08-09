import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { Palette } from "lucide-react";

const UISettingsButton = ({ style, className, onClick }) => {
  const { themeColor } = useTheme();

  const accentColor = themeColor.washType === "light" ? "#000" : "#fff";
  const onThemeColor = themeColor.onColor || accentColor;

  return (
    <motion.button
      onClick={onClick}
      initial="initial"
      whileHover="hover"
      className={`flex flex-col items-center justify-start transition-colors duration-300 group ${className}`}
      variants={{
        initial: { height: 48 },
        hover: { height: 140 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        backgroundColor: themeColor.value,
        color: onThemeColor,
        borderRadius: "0 0 16px 16px",
        borderLeft: `2px solid ${onThemeColor}`,
        borderRight: `2px solid ${onThemeColor}`,
        borderBottom: `2px solid ${onThemeColor}`,
        borderTop: "none",
        padding: "12px 6px",
        width: "42px",
        boxShadow: `0 4px 12px ${themeColor.value}33`,
        overflow: "hidden",
        ...style,
      }}
    >
      <Palette
        size={28}
        className="flex-shrink-0 opacity-90 group-hover:scale-110 transition-transform"
      />
      <motion.span
        variants={{
          initial: { opacity: 0, y: -20 },
          hover: { opacity: 1, y: 0 },
        }}
        transition={{ delay: 0.1 }}
        style={{
          fontSize: "9px",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
        }}
        className="font-comfortaa uppercase font-black tracking-widest mt-4 whitespace-nowrap"
      >
        UI Settings
      </motion.span>
    </motion.button>
  );
};

export default UISettingsButton;