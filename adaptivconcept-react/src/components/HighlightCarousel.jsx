import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const highlights = [
    { 
        title: "Frontend Engineering", 
        subtitle: "Specializing in React, Vanilla JS, and jQuery to build 100% pixel-perfect, highly interactive user interfaces. #HTML #CSS #VanillaJS #jQuery" 
    },
    { 
        title: "Backend Authority", 
        subtitle: "Architecting robust systems with Vanilla PHP and Laravel for secure, high-traffic governmental applications. #PHP #Laravel #Node" 
    },
    { 
        title: "Data Intelligence", 
        subtitle: "Leveraging Python and Power BI to transform complex health data into visual, actionable strategic insights. #Python #DataAnalysis" 
    },
    { 
        title: "Process Automation", 
        subtitle: "Mastering Microsoft Power Automate and Power Apps to streamline enterprise-level business operations. #PowerPlatform" 
    },
    { 
        title: "Database Scalability", 
        subtitle: "Expert-level administration of MySQL and SQL Server environments for mission-critical data integrity. #MySQL #SQLServer" 
    },
    { 
        title: "Award-Winning Innovation", 
        subtitle: "Gold Award Innovator recognized for pioneering digital patient experience solutions at a national level." 
    },
    { 
        title: "Microsoft 365 Ecosystem", 
        subtitle: "Bridging the gap between enterprise legacy and modern cloud-native solutions with Microsoft 365 and Azure. #M365 #Azure" 
    }
];

const HighlightCarousel = ({ className = "" }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % highlights.length);
        }, 8000);

        return () => clearInterval(timer);
    }, []);

    const current = highlights[index];

    return (
        <div className={`flex flex-col items-center justify-center text-center px-4 ${className}`}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={`highlight-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center gap-2"
                >
                    <h3 
                        className="text-5xl md:text-6xl font-bold text-adaptiv-orange tracking-tight uppercase"
                        style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}
                    >
                        {current.title}
                    </h3>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-white text-lg md:text-xl max-w-2xl font-light italic"
                        style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.9)' }}
                    >
                        {current.subtitle}
                    </motion.p>
                </motion.div>
            </AnimatePresence>
            
            {/* Subtle indicator */}
            <div className="flex gap-2 mt-8">
                {highlights.map((_, i) => (
                    <div 
                        key={i}
                        className={`h-1 w-4 rounded-full transition-all duration-500 ${
                            i === index ? "bg-adaptiv-orange w-8" : "bg-gray-800"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HighlightCarousel;
