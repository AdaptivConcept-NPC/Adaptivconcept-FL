import React from "react";
import { Zap } from "lucide-react";

const ControlPanel = ({ level, userStyles, onControlChange }) => {
  return (
    <div className="glass-theme rounded-2xl p-6 md:p-8 mb-6">
      <h3 className="text-xs font-bold tracking-widest uppercase text-low mb-6 flex items-center gap-2 font-poppins">
        <Zap size={14} style={{ color: "var(--theme-color)" }} />
        CSS Flexbox Rules
      </h3>

      <div className="space-y-6">
        {level.controls.map((ctrl) => (
          <div key={ctrl.property} className="flex flex-col gap-2">
            <label className="text-sm font-mono text-high block">
              <span className="text-[#39ff14] font-bold">{ctrl.label}</span>:
            </label>
            <div className="flex flex-wrap gap-2">
              {ctrl.options.map((opt) => {
                const isActive = userStyles[ctrl.property] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => onControlChange(ctrl.property, opt)}
                    className={`digiarch-control-btn px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all duration-200 focus:outline-none ${
                      isActive
                        ? "active border-[#39ff14]/50 shadow-[0_0_15px_rgba(57,255,20,0.15)]"
                        : "glass-theme text-low hover:text-high hover:border-white/20"
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: "rgba(57, 255, 20, 0.12)",
                            color: "#39ff14",
                            borderColor: "rgba(57, 255, 20, 0.4)",
                          }
                        : {}
                    }
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
