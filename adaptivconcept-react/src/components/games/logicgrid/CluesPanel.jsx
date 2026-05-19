import React from "react";
import { CheckSquare, Square } from "lucide-react";

const CluesPanel = ({ clues, completedClues, onToggleClue }) => {
  return (
    <div className="glass-theme rounded-2xl p-6 md:p-8 border border-white/10 mb-6 relative z-10">
      <h3 className="text-xs font-bold tracking-widest uppercase text-[#00f2ff] mb-4 font-mono flex items-center gap-2">
        <span>&gt;</span> LOGICAL CONSTRAINTS (CLUES)
      </h3>
      <div className="space-y-3">
        {clues.map((clue, idx) => {
          const isDone = completedClues.includes(idx);
          return (
            <div
              key={`clue-${idx}`}
              onClick={() => onToggleClue(idx)}
              className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                isDone
                  ? "bg-white/5 border-white/5 opacity-50"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 flex-shrink-0 transition-colors ${
                  isDone ? "text-[#00f2ff]" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {isDone ? <CheckSquare size={16} /> : <Square size={16} />}
              </button>
              <p
                className={`text-sm font-mono leading-relaxed transition-all select-none ${
                  isDone ? "line-through text-neutral-500" : "text-neutral-200"
                }`}
              >
                {clue}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CluesPanel;
