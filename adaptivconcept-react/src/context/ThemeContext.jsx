import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const fonts = [
    { id: 1, fontname: 'StormGust', scale: 1.5 },
    { id: 2, fontname: 'BigPartyBlue', scale: 1.6 },
    { id: 3, fontname: 'GraffitiStream', scale: 1.4 },
    { id: 4, fontname: 'GrindyBrush', scale: 1.0 },
    { id: 5, fontname: 'IslandSplash', scale: 1.3 },
    { id: 6, fontname: 'SudegnakRed', scale: 2.2 },
    // { id: 7, fontname: 'SudegnakOrange', scale: 2.2 },
    { id: 8, fontname: 'SuperBalloon', scale: 1.2 },
    { id: 9, fontname: 'Jacatra', scale: 1.3 },
];

const colors = [
    { name: 'Adaptiv Orange', value: '#ff6600', class: 'text-adaptiv-orange', washType: 'none' },
    { name: 'Neon Blue', value: '#00f2ff', class: 'text-adaptiv-blue', washType: 'white' },
    { name: 'Cyber Green', value: '#39ff14', class: 'text-adaptiv-green', washType: 'white' },
    { name: 'Vibrant Purple', value: '#bc13fe', class: 'text-adaptiv-purple', washType: 'white' },
];



export const ThemeProvider = ({ children }) => {
    const [currentFontIndex, setCurrentFontIndex] = useState(0);
    const [isFontLocked, setIsFontLocked] = useState(false);
    const [themeColor, setThemeColor] = useState(colors[0]);

    useEffect(() => {
        const root = document.documentElement;
        
        // Helper to convert hex to RGB
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? 
                `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
                '255, 102, 0';
        };

        const rgb = hexToRgb(themeColor.value);
        
        root.style.setProperty('--theme-color', themeColor.value);
        root.style.setProperty('--theme-color-rgb', rgb);
        
        // High intensity version for UI elements
        root.style.setProperty('--theme-color-glow', `rgba(${rgb}, 0.4)`);
        
    }, [themeColor]);

    useEffect(() => {
        if (isFontLocked) return;

        const timer = setInterval(() => {
            setCurrentFontIndex((prev) => (prev + 1) % fonts.length);
        }, 5500);

        return () => clearInterval(timer);
    }, [isFontLocked]);

    const toggleFontLock = () => setIsFontLocked(!isFontLocked);
    
    const setFontIndex = (index) => {
        setCurrentFontIndex(index);
        setIsFontLocked(true);
    };

    const nextColor = () => {
        setThemeColor(prev => {
            const nextIdx = (colors.findIndex(c => c.value === prev.value) + 1) % colors.length;
            return colors[nextIdx];
        });
    };

    const activeFontFamily = isFontLocked ? fonts[currentFontIndex].fontname : 'GrindyBrush';
    const activeFontScale = isFontLocked ? fonts[currentFontIndex].scale : fonts.find(f => f.id === 4).scale;

    return (
        <ThemeContext.Provider value={{
            fonts,
            currentFont: fonts[currentFontIndex],
            currentFontIndex,
            isFontLocked,
            setIsFontLocked,
            toggleFontLock,
            setFontIndex,
            colors,
            themeColor,
            nextColor,
            setThemeColor,
            activeFontFamily,
            activeFontScale
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

