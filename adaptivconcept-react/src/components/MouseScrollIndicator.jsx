import React from 'react';
import { motion } from 'framer-motion';

const MouseScrollIndicator = ({ className = "" }) => {
    return (
        <div className={`flex flex-col items-center gap-3 ${className}`}>
            <div className="w-[30px] h-[50px] border-2 border-white/20 rounded-full flex justify-center p-1.5 backdrop-blur-sm">
                <motion.div 
                    animate={{ 
                        y: [0, 15, 0],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="w-1.5 h-1.5 bg-adaptiv-orange rounded-full"
                />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">
                Scroll to Explore
            </span>
        </div>
    );
};

export default MouseScrollIndicator;
