import React from "react";
import { useTheme } from "../../context/ThemeContext";

const UISettingsButton = ({ style, className, onClick }) => {
  const { themeColor } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center transition-all duration-300 group ${className}`}
      style={{
        backgroundColor: themeColor.value,
        color: themeColor.washType === "light" ? "#111" : "#fff",
        borderRadius: "0 0 25% 25%",
        borderLeft: `2px solid #fff`,
        borderRight: `2px solid #fff`,
        borderBottom: `2px solid #fff`,
        borderTop: "none",
        padding: "6px 12px 10px 12px",
        width: "48px",
        height: "54px",
        boxShadow: `0 4px 12px ${themeColor.value}33`,
        ...style,
      }}
    >
      <svg
        width="3"
        height="22"
        viewBox="0 0 3 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-95 group-hover:scale-y-110 transition-transform"
      >
        <rect width="10" height="28" rx="1.5" fill="currentColor" />
      </svg>
      <span
        style={{ fontSize: "6px" }}
        className="uppercase font-black tracking-widest mt-1 opacity-70 group-hover:opacity-100 transition-opacity"
      >
        settings
      </span>
    </button>
  );
};

export default UISettingsButton;