import React from "react";
import { Check, X } from "lucide-react";

const LogicGridMatrix = ({ level, grid, onToggleCell }) => {
  const { N, categories } = level;

  // Header items arrays
  const colItems = [...categories.B.items, ...categories.C.items];
  const rowItems = [...categories.A.items, ...categories.C.items];

  // Helper to determine if a cell coordinate is in the inactive subgrid
  const isInactiveCell = (r, c) => {
    return r >= N && c >= N;
  };

  // Helper to get border classes separating the subgrids
  const getCellBorderClass = (r, c) => {
    let classes = "";
    // Bold border between subgrids
    if (r === N - 1) classes += " border-b-2 border-neutral-400";
    else classes += " border-b border-neutral-700/50";

    if (c === N - 1) classes += " border-r-2 border-neutral-400";
    else classes += " border-r border-neutral-700/50";

    return classes;
  };

  return (
    <div className="w-full overflow-x-auto pb-4 relative z-10 flex justify-center">
      <div className="min-w-[480px] max-w-full glass-theme p-4 rounded-2xl border border-white/10 select-none">
        <table className="border-collapse mx-auto">
          <thead>
            {/* Category Names Header (Top Labels) */}
            <tr>
              <th className="p-2"></th>
              <th
                colSpan={N}
                className="text-[10px] font-mono text-center tracking-widest text-[#00f2ff] uppercase border-b border-neutral-600 pb-1"
              >
                {categories.B.name}
              </th>
              <th
                colSpan={N}
                className="text-[10px] font-mono text-center tracking-widest text-adaptiv-orange uppercase border-b border-neutral-600 pb-1"
              >
                {categories.C.name}
              </th>
            </tr>
            {/* Item rotated labels */}
            <tr>
              <th className="p-2 min-w-[120px] text-right font-mono text-xs text-neutral-400">
                {categories.A.name} / {categories.C.name}
              </th>
              {colItems.map((item, idx) => (
                <th
                  key={`col-head-${idx}`}
                  className="p-2 w-10 h-28 vertical-text text-left font-mono text-[11px] text-high whitespace-nowrap align-bottom pb-4"
                >
                  <div className="rotate-[-45deg] origin-bottom-left translate-x-3 translate-y-3 font-semibold tracking-wide">
                    {item}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowItems.map((rowItem, rIdx) => {
              // Determine if this is a Category A row or Category C row
              const isCatARow = rIdx < N;
              return (
                <tr key={`row-${rIdx}`} className="h-10 hover:bg-white/5 transition-colors">
                  {/* Row Header Label */}
                  <td className="pr-4 text-right font-mono text-xs text-high font-semibold border-r border-neutral-600">
                    <span className={isCatARow ? "text-neutral-200" : "text-adaptiv-orange"}>
                      {rowItem}
                    </span>
                  </td>
                  {/* Cells */}
                  {colItems.map((colItem, cIdx) => {
                    const inactive = isInactiveCell(rIdx, cIdx);
                    const cellState = grid[rIdx]?.[cIdx] || "empty";
                    const borderClass = getCellBorderClass(rIdx, cIdx);

                    if (inactive) {
                      return (
                        <td
                          key={`cell-${rIdx}-${cIdx}`}
                          className={`w-10 h-10 bg-neutral-950/80 diagonal-hatching ${borderClass}`}
                        />
                      );
                    }

                    return (
                      <td
                        key={`cell-${rIdx}-${cIdx}`}
                        onClick={() => onToggleCell(rIdx, cIdx)}
                        className={`w-10 h-10 text-center cursor-pointer relative group transition-all hover:bg-[#00f2ff]/10 ${borderClass}`}
                      >
                        {/* Interactive cell inner marker */}
                        {cellState === "cross" && (
                          <X size={16} className="text-red-500 mx-auto animate-scale-in" />
                        )}
                        {cellState === "check" && (
                          <Check size={18} className="text-[#39ff14] mx-auto animate-scale-in shadow-[0_0_10px_#39ff14/50]" />
                        )}
                        {cellState === "empty" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-neutral-700/50 group-hover:bg-[#00f2ff]/50 mx-auto transition-colors" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogicGridMatrix;
