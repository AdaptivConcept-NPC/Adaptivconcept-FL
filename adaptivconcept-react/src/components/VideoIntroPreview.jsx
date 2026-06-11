import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

const VideoIntroPreview = ({ 
  videoSrc = "/media/sample_promo_vid_aigen.mp4",
  posterSrc = "/media/thabang_vector_wallpaper_3.png",
  className = "" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className={`relative w-full max-w-4xl aspect-video rounded-[32px] overflow-hidden glass-theme shadow-2xl border border-theme group ${className}`}>
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-pointer"
            onClick={togglePlay}
          >
            {/* Poster Image */}
            <img 
              src={posterSrc} 
              alt="Video Preview" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Overlay Gradient (stronger, bottom transparent) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                className="relative"
              >
                {/* Pulse rings */}
                <div className="absolute inset-0 rounded-full bg-adaptiv-orange/30 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-adaptiv-orange/20 animate-pulse delay-75" />
                
                <div className="relative w-20 h-20 bg-adaptiv-orange rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(var(--theme-color-rgb),0.5)]">
                  <Play size={32} className="text-white fill-white ml-1" />
                </div>
              </motion.div>
            </div>

            {/* Info Badge */}
            <div className="absolute bottom-8 left-8 flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-adaptiv-orange">
                Intro Selection
              </span>
              <h4 className="text-xl md:text-2xl font-comfortaa font-bold text-white">
                Engineering Future States
              </h4>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="absolute inset-0 bg-black flex items-center justify-center"
          >
            <video
              src={videoSrc}
              controls
              autoPlay
              className="w-full h-full object-contain"
              onEnded={() => setIsPlaying(false)}
            />
            
            {/* Close Button Overlay */}
            <button 
              onClick={togglePlay}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all z-50 border border-white/20"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoIntroPreview;
