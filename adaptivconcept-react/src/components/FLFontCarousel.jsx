import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Lock, Unlock } from 'lucide-react';

const FLFontCarousel = ({ size = "text-8xl", className = "", useFullText = false, isStacked = false }) => {
    const { currentFont, isFontLocked, toggleFontLock, themeColor } = useTheme();

    const text = useFullText ? "Freelancing" : "FL";

    return (
        <div 
            className={`relative flex ${isStacked ? 'flex-col' : 'flex-row'} items-center justify-center cursor-pointer group ${size} ${className}`}
            onClick={(e) => {
                e.preventDefault();
                toggleFontLock();
            }}
            title={isFontLocked ? "Font Locked - Click to unlock" : "Click to lock this font"}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${currentFont.fontname}-${text}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ 
                        duration: 0.5, 
                        ease: "easeInOut"
                    }}
                    className="font-bold select-none whitespace-nowrap relative"
                    style={{ 
                        fontFamily: currentFont.fontname,
                        fontSize: `${currentFont.scale}em`,
                        color: themeColor.value,
                        textShadow: '3px 3px 0px rgba(0,0,0,0.8)'
                    }}
                >
                    {text}
                    
                    {/* Lock Indicator Overlay - subtle */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isFontLocked ? 1 : 0 }}
                        className="absolute -top-2 -right-4 text-white/40 group-hover:text-white/80 transition-colors"
                    >
                        {isFontLocked ? <Lock size={12} /> : <Unlock size={12} className="opacity-0 group-hover:opacity-100" />}
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default FLFontCarousel;
