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
    { name: 'Polished Silver', value: '#D1D1D1', class: 'text-silver', washType: 'light' },
    { name: 'Coal', value: '#111111', class: 'text-coal', washType: 'coal' },
];



export const ThemeProvider = ({ children }) => {
    const [currentFontIndex, setCurrentFontIndex] = useState(() => {
        const saved = localStorage.getItem('adaptiv_font_index');
        return saved !== null ? parseInt(saved, 10) : 0;
    });
    
    const [isFontLocked, setIsFontLocked] = useState(() => {
        const saved = localStorage.getItem('adaptiv_font_locked');
        return saved !== null ? saved === 'true' : false;
    });

    const [themeColor, setThemeColor] = useState(() => {
        const savedValue = localStorage.getItem('adaptiv_theme_color');
        if (savedValue) {
            return colors.find(c => c.value === savedValue) || colors[0];
        }
        return colors[0];
    });

    // Persist font state
    useEffect(() => {
        localStorage.setItem('adaptiv_font_locked', isFontLocked);
        localStorage.setItem('adaptiv_font_index', currentFontIndex);
    }, [isFontLocked, currentFontIndex]);

    // Persist theme choice
    useEffect(() => {
        localStorage.setItem('adaptiv_theme_color', themeColor.value);
    }, [themeColor]);

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

        // Glass System Dynamic Variables
        if (themeColor.washType === 'light') {
            // Polished Silver / Light mode
            root.style.setProperty('--bg', '#f5f5f7');
            root.style.setProperty('--text', '#1d1d1f');
            root.style.setProperty('--text-h', '#000000');
            root.style.setProperty('--text-dim', '#86868b');
            root.style.setProperty('--heading-color', 'var(--theme-color)');
            root.style.setProperty('--heading-shadow', '2px 2px 0px rgba(0, 0, 0, 0.15)');
            root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
            root.style.setProperty('--glass-blur', '32px');
            root.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.08)');
            root.style.setProperty('--glass-shadow', '0 8px 32px 0 rgba(0, 0, 0, 0.1)');
        } else if (themeColor.washType === 'coal') {
            // Coal / Deep Dark mode
            root.style.setProperty('--bg', '#050505');
            root.style.setProperty('--text', '#a1a1a6');
            root.style.setProperty('--text-h', '#ffffff');
            root.style.setProperty('--text-dim', '#6b6375');
            root.style.setProperty('--heading-color', '#ffffff');
            root.style.setProperty('--heading-shadow', '2px 2px 0px rgba(0, 0, 0, 1)');
            root.style.setProperty('--glass-bg', 'rgba(18, 18, 18, 0.8)');
            root.style.setProperty('--glass-blur', '64px');
            root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.05)');
            root.style.setProperty('--glass-shadow', '0 8px 32px 0 rgba(0, 0, 0, 0.5)');
        } else if (themeColor.washType === 'none') {
            // Default Adaptiv Orange / Dark
            root.style.setProperty('--bg', '#0a0a0a');
            root.style.setProperty('--text', '#f8f9fa');
            root.style.setProperty('--text-h', '#ffffff');
            root.style.setProperty('--text-dim', '#9ca3af');
            root.style.setProperty('--heading-color', 'var(--theme-color)');
            root.style.setProperty('--heading-shadow', '2px 2px 0px rgba(0, 0, 0, 0.8)');
            root.style.setProperty('--glass-bg', 'rgba(15, 15, 16, 0.4)');
            root.style.setProperty('--glass-blur', '64px');
            root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
            root.style.setProperty('--glass-shadow', '0 8px 32px 0 rgba(0, 0, 0, 0.37)');
        } else {
            // Colored Wash Themes (Blue, Green, Purple)
            root.style.setProperty('--bg', '#0a0a0a');
            root.style.setProperty('--text', '#f8f9fa');
            root.style.setProperty('--text-h', '#ffffff');
            root.style.setProperty('--text-dim', 'rgba(255, 255, 255, 0.6)');
            root.style.setProperty('--heading-color', 'var(--theme-color)');
            root.style.setProperty('--heading-shadow', '2px 2px 0px rgba(0, 0, 0, 0.8)');
            root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.05)');
            root.style.setProperty('--glass-blur', '40px');
            root.style.setProperty('--glass-border', `rgba(${rgb}, 0.2)`);
            root.style.setProperty('--glass-shadow', '0 8px 32px 0 rgba(0, 0, 0, 0.37)');
        }
        
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

