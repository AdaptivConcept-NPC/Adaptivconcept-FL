import React from "react";

const ColorSlider = ({ label, min, max, value, onChange, type, currentHSL }) => {
  const { H, S, L } = currentHSL;

  // Compute dynamic track styles
  let trackBackground = "";
  if (type === "H") {
    trackBackground = "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)";
  } else if (type === "S") {
    trackBackground = `linear-gradient(to right, hsl(${H}, 0%, ${L}%), hsl(${H}, 100%, ${L}%))`;
  } else if (type === "L") {
    trackBackground = `linear-gradient(to right, #000000, hsl(${H}, ${S}%, 50%), #ffffff)`;
  }

  return (
    <div className="w-full mb-5 font-mono">
      <div className="flex justify-between items-center mb-1.5 text-xs text-neutral-400">
        <span className="font-bold tracking-wider text-neutral-300">{label}</span>
        <span className="font-semibold" style={{ color: type === "H" ? "#bc13fe" : "#00f2ff" }}>
          {value}
          {type === "H" ? "°" : "%"}
        </span>
      </div>
      <div className="relative flex items-center h-6">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none transition-all duration-150"
          style={{
            background: trackBackground,
            boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.4)",
          }}
        />
      </div>
    </div>
  );
};

export default ColorSlider;
