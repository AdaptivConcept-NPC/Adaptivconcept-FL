import React from "react";

const HarmonyGuide = ({ level, playerColors }) => {
  const { mode, baseColor, targets } = level;

  // Helper to get coordinates on a circle of radius 38 (center 50, 50)
  const getCoords = (hue) => {
    // 0 degrees is top
    const angleRad = ((hue - 90) * Math.PI) / 180;
    const r = 38;
    return {
      x: 50 + r * Math.cos(angleRad),
      y: 50 + r * Math.sin(angleRad),
    };
  };

  const center = { x: 50, y: 50 };

  return (
    <div className="flex flex-col items-center glass-theme p-6 rounded-2xl border border-white/10 w-full font-mono relative z-10">
      <div className="w-full flex flex-col mb-4">
        <h3 className="text-xs font-bold tracking-widest text-[#bc13fe] uppercase mb-1">
          <span>&gt;</span> VECTOR SPECTRUM WHEEL
        </h3>
        <p className="text-[10px] text-neutral-400 leading-normal">
          Visualizes HSL Hue coordinates. Align your solid vectors with target circles to stabilize the color field.
        </p>
      </div>

      {/* Main Wheel Container - Fixed size via style to prevent collapsing */}
      <div
        className="relative rounded-full p-1 bg-neutral-950/80 border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.6)] flex items-center justify-center mb-4"
        style={{
          width: "200px",
          height: "200px",
          minWidth: "200px",
          minHeight: "200px",
        }}
      >
        {/* Colorful wheel background - sharper and more opaque */}
        <div
          className="absolute inset-1 rounded-full opacity-65"
          style={{
            background:
              "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
          }}
        />

        {/* Outer overlay ring */}
        <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />

        {/* Faint center hub */}
        <div className="absolute w-4 h-4 rounded-full bg-black/80 border border-white/30 z-20" />

        {/* SVG Drawing Layer */}
        <svg
          className="w-full h-full absolute inset-0 z-10 overflow-visible"
          viewBox="0 0 100 100"
          style={{ width: "100%", height: "100%" }}
        >
          {/* Geometric Harmony Helpers (Guides) */}
          {mode === "complementary" && baseColor && targets[0] && (
            <line
              x1={getCoords(baseColor.H).x}
              y1={getCoords(baseColor.H).y}
              x2={getCoords(targets[0].H).x}
              y2={getCoords(targets[0].H).y}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="0.8"
              strokeDasharray="2,2"
            />
          )}

          {mode === "triadic" && baseColor && targets.length === 2 && (
            <polygon
              points={`
                ${getCoords(baseColor.H).x},${getCoords(baseColor.H).y}
                ${getCoords(targets[0].H).x},${getCoords(targets[0].H).y}
                ${getCoords(targets[1].H).x},${getCoords(targets[1].H).y}
              `}
              fill="rgba(188, 19, 254, 0.08)"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="0.8"
              strokeDasharray="2,2"
            />
          )}

          {/* Base Color Ray */}
          {baseColor && (
            (() => {
              const coords = getCoords(baseColor.H);
              return (
                <>
                  <line
                    x1={center.x}
                    y1={center.y}
                    x2={coords.x}
                    y2={coords.y}
                    stroke={`hsl(${baseColor.H}, 100%, 50%)`}
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                    opacity="0.9"
                  />
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="3.5"
                    fill={`hsl(${baseColor.H}, 100%, 50%)`}
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                </>
              );
            })()
          )}

          {/* Target Color Rays */}
          {targets.map((target, idx) => {
            const coords = getCoords(target.H);
            return (
              <g key={`target-ray-${idx}`}>
                <line
                  x1={center.x}
                  y1={center.y}
                  x2={coords.x}
                  y2={coords.y}
                  stroke={`hsl(${target.H}, ${target.S}%, ${target.L}%)`}
                  strokeWidth="1.5"
                  opacity="0.7"
                />
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="5"
                  fill="none"
                  stroke={`hsl(${target.H}, ${target.S}%, ${target.L}%)`}
                  strokeWidth="2"
                  className="animate-pulse"
                />
              </g>
            );
          })}

          {/* Player Color Rays */}
          {playerColors.map((color, idx) => {
            const coords = getCoords(color.H);
            return (
              <g key={`player-ray-${idx}`}>
                <line
                  x1={center.x}
                  y1={center.y}
                  x2={coords.x}
                  y2={coords.y}
                  stroke={`hsl(${color.H}, ${color.S}%, ${color.L}%)`}
                  strokeWidth="2.5"
                  className="drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]"
                />
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="4"
                  fill={`hsl(${color.H}, ${color.S}%, ${color.L}%)`}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend Labels */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] text-neutral-400">
        {baseColor && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block border border-white/20"
              style={{ backgroundColor: `hsl(${baseColor.H}, 100%, 50%)` }}
            />
            <span>Base ({baseColor.H}°)</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block border-2 border-dashed border-[#bc13fe]" />
          <span>Target Vector</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block border border-white bg-white" />
          <span>Your Mixed Color</span>
        </div>
      </div>
    </div>
  );
};

export default HarmonyGuide;
