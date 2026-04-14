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
    { name: 'Adaptiv Orange', value: '#ff6600', class: 'text-adaptiv-orange' },
    { name: 'Neon Blue', value: '#00f2ff', class: 'text-adaptiv-blue' },
    { name: 'Cyber Green', value: '#39ff14', class: 'text-adaptiv-green' },
    { name: 'Vibrant Purple', value: '#bc13fe', class: 'text-adaptiv-purple' },
];

export const ThemeProvider = ({ children }) => {
    const [currentFontIndex, setCurrentFontIndex] = useState(0);
    const [isFontLocked, setIsFontLocked] = useState(false);
    const [themeColor, setThemeColor] = useState(colors[0]);

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
