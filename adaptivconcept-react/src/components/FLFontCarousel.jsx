import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Lock, Unlock } from "lucide-react";

const FLFontCarousel = ({
  size = "text-8xl",
  className = "",
  useFullText = false,
  isStacked = false,
  color = null,
}) => {
  const { fonts, currentFont, isFontLocked, toggleFontLock } = useTheme();

  const text = useFullText ? "Freelancing" : "FL";

  // Safety check: ensure currentFont exists before accessing properties
  if (!currentFont) return null;

  return (
    <div
      className={`relative flex ${isStacked ? "flex-col" : "flex-row"} items-center justify-center cursor-pointer group ${size} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        toggleFontLock();
      }}
      title={
        isFontLocked
          ? "Font Locked - Click to unlock"
          : "Click to lock this font"
      }
    >
      {/* Invisible Sizer to establish parent container dimensions */}
      <div className="invisible pointer-events-none select-none font-bold">
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <p className="m-0">{text}</p>
        </div>
      </div>

      {/* Pre-rendered fonts to trigger preloading and instant switching */}
      {fonts.map((font) => {
        const isActive = font.fontname === currentFont.fontname;

        return (
          <motion.div
            key={font.fontname}
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              scale: isActive ? 1 : 0.8,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="absolute font-bold select-none whitespace-nowrap"
            style={{
              fontFamily: font.fontname,
              fontSize: `${font.scale || 1}em`,
              color: color || "var(--heading-color)",
              textShadow: "var(--heading-shadow)",
              pointerEvents: isActive ? "auto" : "none",
              zIndex: isActive ? 10 : 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <p className="m-0">{text}</p>
            </div>
          </motion.div>
        );
      })}

      {/* Lock Indicator Overlay - subtle, aligned to the container */}
      <motion.div
        initial={false}
        animate={{ opacity: isFontLocked ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute -top-2 -right-4 text-white/40 group-hover:text-white/80 transition-colors z-20"
      >
        {isFontLocked ? (
          <Lock size={12} />
        ) : (
          <Unlock size={12} className="opacity-0 group-hover:opacity-100" />
        )}
      </motion.div>
    </div>
  );
};

export default FLFontCarousel;
