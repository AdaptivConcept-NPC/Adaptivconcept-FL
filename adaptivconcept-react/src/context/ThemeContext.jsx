import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const fonts = [
    { id: 1, fontname: 'StormGust', fontsize: '1.8em' },
    { id: 2, fontname: 'BigPartyBlue', fontsize: '2.2em' },
    { id: 3, fontname: 'GraffitiStream', fontsize: '1.8em' },
    { id: 4, fontname: 'GrindyBrush', fontsize: '1.4em' },
    { id: 5, fontname: 'IslandSplash', fontsize: '1.6em' },
    { id: 6, fontname: 'SudegnakRed', fontsize: '2.2em' },
    // { id: 7, fontname: 'SudegnakOrange', fontsize: '2.2em' },
    { id: 8, fontname: 'SuperBalloon', fontsize: '1.4em' },
    { id: 9, fontname: 'Jacatra', fontsize: '1.4em' },
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
            activeFontFamily
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
