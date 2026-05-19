import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, ArrowRight, Star, Loader2, Award, Zap, Clock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useArcade } from "../../../context/ArcadeContext";

const CompletionScreen = ({ stars, attempts, totalScore, totalTime, onReset }) => {
  const { fetchLeaderboard, user } = useArcade();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard("digiarch")
      .then((data) => {
        setReferencedLeaderboard(data);
      })
      .catch((err) => {
        console.error("Leaderboard load failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchLeaderboard]);

  const setReferencedLeaderboard = (data) => {
    setLeaderboard(data || []);
  };

  const totalStars = stars.reduce((a, b) => a + (b || 0), 0);
  const maxStars = stars.length * 3;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center relative z-10 py-10 max-w-4xl mx-auto px-4"
    >
      {/* Trophy Section */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="mb-6 inline-block"
      >
        <Trophy size={72} className="mx-auto" style={{ color: "#ffcc00", filter: "drop-shadow(0 0 15px rgba(255,204,0,0.4))" }} />
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-comfortaa font-bold text-high mb-3">
        System <span className="text-adaptiv-orange">Stabilized</span>
      </h1>
      <p className="text-low text-sm md:text-base max-w-xl mx-auto font-poppins mb-8">
        Flexbox engine parameters normalized. All layouts successfully constraint-solved.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-theme p-4 rounded-xl text-center border border-white/5">
          <Award size={18} className="mx-auto mb-1 text-[#39ff14]" />
          <span className="text-[10px] font-mono text-low uppercase block">Score</span>
          <span className="text-xl font-bold text-high font-mono">{totalScore}</span>
        </div>
        <div className="glass-theme p-4 rounded-xl text-center border border-white/5">
          <Star size={18} className="mx-auto mb-1 text-yellow-400" />
          <span className="text-[10px] font-mono text-low uppercase block">Stars</span>
          <span className="text-xl font-bold text-high font-mono">
            {totalStars} / {maxStars}
          </span>
        </div>
        <div className="glass-theme p-4 rounded-xl text-center border border-white/5">
          <Zap size={18} className="mx-auto mb-1 text-cyan-400" />
          <span className="text-[10px] font-mono text-low uppercase block">Total Retries</span>
          <span className="text-xl font-bold text-high font-mono">{attempts}</span>
        </div>
        <div className="glass-theme p-4 rounded-xl text-center border border-white/5">
          <Clock size={18} className="mx-auto mb-1 text-purple-400" />
          <span className="text-[10px] font-mono text-low uppercase block">Duration</span>
          <span className="text-xl font-bold text-high font-mono">{totalTime}s</span>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="glass-theme rounded-2xl p-6 border border-white/10 mb-8 text-left max-w-2xl mx-auto">
        <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-high mb-4 flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#39ff14]" />
          Global Leaderboard (Synced via AI_Codex)
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-low">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span>Retrieving records...</span>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8 text-low font-mono text-xs">
            No records found. Be the first to claim a rank!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-low pb-2">
                  <th className="text-left py-2 font-bold uppercase tracking-wider">Rank</th>
                  <th className="text-left py-2 font-bold uppercase tracking-wider">Developer</th>
                  <th className="text-right py-2 font-bold uppercase tracking-wider">Score</th>
                  <th className="text-right py-2 font-bold uppercase tracking-wider">Stars</th>
                  <th className="text-right py-2 font-bold uppercase tracking-wider">Accuracy</th>
                  <th className="text-right py-2 font-bold uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, idx) => {
                  const isGold = idx === 0;
                  const isSilver = idx === 1;
                  const isBronze = idx === 2;
                  const isCurrentUser = user && user.username === entry.username;
                  
                  return (
                    <tr 
                      key={idx} 
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        isCurrentUser ? "bg-[#39ff14]/5 text-[#39ff14]" : ""
                      }`}
                    >
                      <td className="py-2.5 font-bold">
                        {isGold && <span style={{ color: "#ffcc00" }}>🥇 1</span>}
                        {isSilver && <span style={{ color: "#00f2ff" }}>🥈 2</span>}
                        {isBronze && <span style={{ color: "#fd3b12" }}>🥉 3</span>}
                        {!isGold && !isSilver && !isBronze && ` ${idx + 1}`}
                      </td>
                      <td className="py-2.5 font-bold flex items-center gap-1">
                        {entry.username}
                        {isCurrentUser && <span className="text-[9px] uppercase border border-[#39ff14]/30 px-1 py-0.2 rounded font-mono">You</span>}
                      </td>
                      <td className="py-2.5 text-right font-bold">{entry.score}</td>
                      <td className="py-2.5 text-right font-bold text-yellow-400">{"★".repeat(entry.stars_earned)}</td>
                      <td className="py-2.5 text-right">{entry.accuracy.toFixed(0)}%</td>
                      <td className="py-2.5 text-right text-low">{entry.time_spent_sec}s</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={onReset}
          className="px-6 py-3.5 rounded-xl font-bold font-comfortaa border border-white/10 bg-white/5 hover:bg-white/10 text-high transition-all flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Play Again
        </button>
        <Link
          to="/arcade"
          className="px-6 py-3.5 rounded-xl font-bold font-comfortaa bg-adaptiv-orange text-white hover:opacity-90 transition-all flex items-center gap-2"
        >
          <span>Back to Arcade</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
};

export default CompletionScreen;
