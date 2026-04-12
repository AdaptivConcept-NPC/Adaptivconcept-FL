import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fonts = [
    { id: 1, fontname: 'StormGust', fontsize: '1.8em' },
    { id: 2, fontname: 'BigPartyBlue', fontsize: '2.2em' },
    // { id: 2, fontname: 'BigPartyGreen', fontsize: '1em' },
    // { id: 3, fontname: 'BlackTakora', fontsize: '1em' },
    // { id: 4, fontname: 'Fattern', fontsize: '1em' },
    { id: 3, fontname: 'GraffitiStream', fontsize: '1.8em' },
    { id: 4, fontname: 'GrindyBrush', fontsize: '1.4em' },
    // { id: 7, fontname: 'HelpMe', fontsize: '1em' },
    { id: 5, fontname: 'IslandSplash', fontsize: '1.6em' },
    // { id: 9, fontname: 'Measter', fontsize: '1em' },
    // { id: 10, fontname: 'NoctraDrip', fontsize: '1em' },
    // { id: 11, fontname: 'PermanentMarker', fontsize: '1em' },
    // { id: 12, fontname: 'PunkKid', fontsize: '1em' },
    { id: 6, fontname: 'SudegnakRed', fontsize: '2.2em' },
    { id: 7, fontname: 'SudegnakOrange', fontsize: '2.2em' },
    { id: 8, fontname: 'SuperBalloon', fontsize: '1.4em' },
    { id: 9, fontname: 'Jacatra', fontsize: '1.4em' },
    // projects\adaptivconcept-npc\Adaptivconcept-FL\adaptivconcept-react\public\fonts\sudegnakno4\SudegnakNo4-Red.ttf added as SudegnakRed
].filter(f => f.fontname); // Filter to ensure we only use defined entries

const FLFontCarousel = ({ size = "text-8xl", className = "", useFullText = false, isStacked = false }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % fonts.length);
        }, 5500); // Cycle every 5.5 seconds as requested

        return () => clearInterval(timer);
    }, []);

    const text = useFullText ? "Freelancing" : "FL";
    const currentFont = fonts[index];

    return (
        <div className={`relative flex ${isStacked ? 'flex-col' : 'flex-row'} items-center justify-center ${size} ${className}`}>
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
                    className="font-bold text-adaptiv-orange select-none cursor-default whitespace-nowrap"
                    style={{ 
                        fontFamily: currentFont.fontname,
                        fontSize: currentFont.fontsize,
                        // textShadow: '0 0 15px rgba(255, 102, 0, 0.2)',
                        textShadow: '3px 3px 0px rgba(0,0,0,0.8)'
                    }}
                >
                    {text}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default FLFontCarousel;
