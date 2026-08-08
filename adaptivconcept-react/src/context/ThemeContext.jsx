import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const defaultRetroDitherSettings = {
  enabled: true,
  strength: 0.75,
  pixelSize: 2.5,
  scanlines: 0.3,
  clickWave: 0.8,
};

const fonts = [
  { id: 1, fontname: "StormGust", scale: 1.6 }, // good
  { id: 2, fontname: "BigPartyBlue", scale: 1.8 }, // good
  { id: 3, fontname: "GraffitiStream", scale: 1.4 }, // good
  { id: 4, fontname: "GrindyBrush", scale: 1.4 }, // good
  { id: 5, fontname: "IslandSplash", scale: 1.3 }, // good
  { id: 6, fontname: "SudegnakRed", scale: 2.2 }, // good
  { id: 8, fontname: "SuperBalloon", scale: 1.2 }, // good
  { id: 9, fontname: "Jacatra", scale: 1.3 }, // good
  { id: 10, fontname: "CoralPixels", scale: 1.6 }, // good
  { id: 11, fontname: "Eddie", scale: 1.5 }, // good
  { id: 12, fontname: "Fanzine", scale: 1.3 }, // good
  { id: 13, fontname: "FetteUNZFraktur", scale: 1.4 }, // good
  { id: 14, fontname: "Gunmetal", scale: 1.6 }, // good
  { id: 15, fontname: "PixelFJ8pt1", scale: 1.2 }, // good
  { id: 16, fontname: "SeniorService", scale: 0.8 }, // good
  { id: 17, fontname: "Catgirl", scale: 1.2 }, // good
  { id: 18, fontname: "WhimzeeArt", scale: 0.9 }, // flag: showing as a serif font! lets leave it in though
];

const overkillFonts = [
  { id: 101, fontname: "Bitwise", scale: 1.1 }, // good
  { id: 104, fontname: "Draco", scale: 0.7 }, // good
  { id: 107, fontname: "Quickless", scale: 1.1 }, //good
  { id: 108, fontname: "SavedByZero", scale: 0.9 }, // good
  { id: 109, fontname: "SparklesTrippies", scale: 0.9 }, // good
  { id: 110, fontname: "Tafelwerk", scale: 1.5 }, // good
  { id: 111, fontname: "ZeroVelocity", scale: 0.8 }, // good
];

const colors = [
  {
    name: "Adaptiv Orange",
    value: "#fd3b12",
    class: "text-adaptiv-orange",
    washType: "none",
  },
  {
    name: "Neon Blue",
    value: "#00f2ff",
    class: "text-adaptiv-blue",
    washType: "white",
  },
  {
    name: "Cyber Green",
    value: "#39ff14",
    class: "text-adaptiv-green",
    washType: "white",
  },
  {
    name: "Vibrant Purple",
    value: "#bc13fe",
    class: "text-adaptiv-purple",
    washType: "white",
  },
  {
    name: "Polished Silver",
    value: "#D1D1D1",
    class: "text-silver",
    washType: "light",
  },
  { name: "Coal", value: "#111111", class: "text-coal", washType: "coal" },
];

export const ThemeProvider = ({ children }) => {
  const [currentFontIndex, setCurrentFontIndex] = useState(() => {
    const saved = localStorage.getItem("adaptiv_font_index");
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [isFontLocked, setIsFontLocked] = useState(() => {
    const saved = localStorage.getItem("adaptiv_font_locked");
    return saved !== null ? saved === "true" : false;
  });

  const [themeColor, setThemeColor] = useState(() => {
    const savedValue = localStorage.getItem("adaptiv_theme_color");
    if (savedValue) {
      return colors.find((c) => c.value === savedValue) || colors[0];
    }
    return colors[0];
  });

  const [isOverkillEnabled, setIsOverkillEnabled] = useState(() => {
    const saved = localStorage.getItem("adaptiv_overkill_enabled");
    return saved !== null ? saved === "true" : false;
  });

  const [isInstantReadabilityEnabled, setIsInstantReadabilityEnabled] = useState(
    () => {
      const saved = localStorage.getItem("adaptiv_instant_readability");
      return saved !== null ? saved === "true" : false;
    },
  );

  const [isRetroDitherEnabled, setIsRetroDitherEnabled] = useState(() => {
    const saved = localStorage.getItem("adaptiv_retro_dither_enabled");
    return saved !== null ? saved === "true" : defaultRetroDitherSettings.enabled;
  });

  const [retroDitherStrength, setRetroDitherStrength] = useState(() => {
    const saved = localStorage.getItem("adaptiv_retro_dither_strength");
    return saved !== null ? Number(saved) : defaultRetroDitherSettings.strength;
  });

  const [retroDitherPixelSize, setRetroDitherPixelSize] = useState(() => {
    const saved = localStorage.getItem("adaptiv_retro_dither_pixel_size");
    return saved !== null ? Number(saved) : defaultRetroDitherSettings.pixelSize;
  });

  const [retroDitherScanlines, setRetroDitherScanlines] = useState(() => {
    const saved = localStorage.getItem("adaptiv_retro_dither_scanlines");
    return saved !== null ? Number(saved) : defaultRetroDitherSettings.scanlines;
  });

  const [retroDitherClickWave, setRetroDitherClickWave] = useState(() => {
    const saved = localStorage.getItem("adaptiv_retro_dither_click_wave");
    return saved !== null ? Number(saved) : defaultRetroDitherSettings.clickWave;
  });

  // Combined font queue
  const activeFonts = isOverkillEnabled ? [...fonts, ...overkillFonts] : fonts;

  // Persist font state
  useEffect(() => {
    localStorage.setItem("adaptiv_font_locked", isFontLocked);
    localStorage.setItem("adaptiv_font_index", currentFontIndex);
  }, [isFontLocked, currentFontIndex]);

  // Persist overkill state
  useEffect(() => {
    localStorage.setItem("adaptiv_overkill_enabled", isOverkillEnabled);

    // Dynamic loading of overkill fonts CSS
    if (isOverkillEnabled) {
      const linkId = "overkill-fonts-css";
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = "/src/styles/overkill-fonts.css";
        document.head.appendChild(link);
      }
    } else {
      const link = document.getElementById("overkill-fonts-css");
      if (link) link.remove();

      // Safety: Reset index if it exceeds the bounds of the standard fonts list
      if (currentFontIndex >= fonts.length) {
        setCurrentFontIndex(0);
      }
    }
  }, [isOverkillEnabled, currentFontIndex]);

  // Persist theme choice
  useEffect(() => {
    localStorage.setItem("adaptiv_theme_color", themeColor.value);
  }, [themeColor]);

  // Persist and apply accessibility settings
  useEffect(() => {
    localStorage.setItem(
      "adaptiv_instant_readability",
      isInstantReadabilityEnabled,
    );
    if (isInstantReadabilityEnabled) {
      document.body.classList.add("accessibility-instant-readability");
    } else {
      document.body.classList.remove("accessibility-instant-readability");
    }
  }, [isInstantReadabilityEnabled]);

  useEffect(() => {
    localStorage.setItem("adaptiv_retro_dither_enabled", isRetroDitherEnabled);
    localStorage.setItem("adaptiv_retro_dither_strength", retroDitherStrength);
    localStorage.setItem("adaptiv_retro_dither_pixel_size", retroDitherPixelSize);
    localStorage.setItem("adaptiv_retro_dither_scanlines", retroDitherScanlines);
    localStorage.setItem("adaptiv_retro_dither_click_wave", retroDitherClickWave);
  }, [isRetroDitherEnabled, retroDitherStrength, retroDitherPixelSize, retroDitherScanlines, retroDitherClickWave]);

  useEffect(() => {
    const root = document.documentElement;

    // Helper to convert hex to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : "255, 102, 0";
    };

    const rgb = hexToRgb(themeColor.value);

    root.style.setProperty("--theme-color", themeColor.value);
    root.style.setProperty("--theme-color-rgb", rgb);
    root.style.setProperty("--text-on-dark", "#f8f9fa");

    // High intensity version for UI elements
    root.style.setProperty("--theme-color-glow", `rgba(${rgb}, 0.4)`);

    // Ensure we can apply high-contrast overrides for specific themes (Coal)
    // Toggle a class on the root so components using utility classes like
    // `text-white` / `fill-white` can be overridden when needed.
    root.classList.toggle("coal-theme", themeColor.washType === "coal");

    // Create a small stylesheet that forces icons/text that use the
    // `text-white`/`fill-white` utilities to render as black in Coal mode.
    // This is a safe, focused override to fix contrast where components
    // still rely on utility classes instead of theme vars.
    const styleId = "theme-contrast-overrides";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.innerHTML = `
        /* Theme contrast overrides injected by ThemeProvider */
        /* Only force SVG/icon elements to black so headings using
           utility classes like .text-white remain white under Coal. */
        .coal-theme svg.fill-white,
        .coal-theme svg.text-white {
          color: #000 !important;
          fill: #000 !important;
          stroke: #000 !important;
        }
        .coal-theme .fill-white { fill: #000 !important; }
      `;
      document.head.appendChild(styleEl);
    }

    // Glass System Dynamic Variables
    if (themeColor.washType === "light") {
      // Polished Silver / Light mode
      root.style.setProperty("--bg", "#f5f5f7");
      root.style.setProperty("--text", "#1d1d1f");
      root.style.setProperty("--text-h", "#000000");
      root.style.setProperty("--text-dim", "#86868b");
      root.style.setProperty("--heading-color", "#111111");
      root.style.setProperty(
        "--heading-shadow",
        "2px 2px 0px rgba(0, 0, 0, 0.15)",
      );
      root.style.setProperty("--heading-stroke", "0px transparent");
      root.style.setProperty("--glass-bg", "rgba(255, 255, 255, 0.6)");
      root.style.setProperty("--glass-bg-hover", "rgba(240, 240, 240, 0.9)");
      root.style.setProperty("--glass-blur", "24px");
      root.style.setProperty("--glass-blur-hover", "40px");
      root.style.setProperty("--glass-border", "#000000");
      root.style.setProperty("--glass-border-hover", "#000000");
      root.style.setProperty("--glass-border-width", "2px");
      root.style.setProperty("--glass-shadow", "6px 6px 0px #111111");
      root.style.setProperty("--glass-glow", "0 0 12px rgba(0, 0, 0, 0.08)");
      root.style.setProperty("--btn-hover-bg", "#000000");
      root.style.setProperty("--btn-hover-text", "#ffffff");
      root.style.setProperty("--input-bg", "rgba(0, 0, 0, 0.03)");
    } else if (themeColor.washType === "coal") {
      // Coal / Deep Dark mode
      root.style.setProperty("--bg", "#050505");
      root.style.setProperty("--text", "#a1a1a6");
      root.style.setProperty("--text-h", "#ffffff");
      root.style.setProperty("--text-dim", "#6b6375");
      root.style.setProperty("--heading-color", "#ffffff");
      root.style.setProperty(
        "--heading-shadow",
        "2px 2px 0px rgba(0, 0, 0, 1)",
      );
      root.style.setProperty("--heading-stroke", "1px rgba(0,0,0,1)");
      root.style.setProperty("--glass-bg", "rgba(18, 18, 18, 0.7)");
      root.style.setProperty("--glass-bg-hover", "rgba(0, 0, 0, 0.95)");
      root.style.setProperty("--glass-blur", "40px");
      root.style.setProperty("--glass-blur-hover", "80px");
      root.style.setProperty("--glass-border", "#ffffff");
      root.style.setProperty("--glass-border-hover", "#ffffff");
      root.style.setProperty("--glass-border-width", "2px");
      root.style.setProperty(
        "--glass-shadow",
        "8px 8px 0px #e5e5e7",
      );
      root.style.setProperty(
        "--glass-glow",
        "0 0 20px rgba(255, 255, 255, 0.12)",
      );
      root.style.setProperty("--btn-hover-bg", "#ffffff");
      root.style.setProperty("--btn-hover-text", "#000000");
      root.style.setProperty("--input-bg", "rgba(255, 255, 255, 0.03)");
    } else if (themeColor.washType === "none") {
      // Default Adaptiv Orange / Dark
      root.style.setProperty("--bg", "#0a0a0a");
      root.style.setProperty("--text", "#f8f9fa");
      root.style.setProperty("--text-h", "#ffffff");
      root.style.setProperty("--text-dim", "#9ca3af");
      root.style.setProperty("--heading-color", "var(--theme-color)");
      root.style.setProperty(
        "--heading-shadow",
        "2px 2px 0px rgba(0, 0, 0, 0.8)",
      );
      root.style.setProperty("--heading-stroke", "0.5px black");
      root.style.setProperty("--glass-bg", "rgba(15, 15, 16, 0.4)");
      root.style.setProperty("--glass-bg-hover", "rgba(0, 0, 0, 0.8)");
      root.style.setProperty("--glass-blur", "64px");
      root.style.setProperty("--glass-blur-hover", "80px");
      root.style.setProperty("--glass-border", "rgba(255, 255, 255, 0.2)");
      root.style.setProperty("--glass-border-hover", `rgba(${rgb}, 0.3)`);
      root.style.setProperty("--glass-border-width", "1px");
      root.style.setProperty(
        "--glass-shadow",
        "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      );
      root.style.setProperty("--glass-glow", "none");
      root.style.setProperty("--btn-hover-bg", "var(--theme-color)");
      root.style.setProperty("--btn-hover-text", "#ffffff");
      root.style.setProperty("--input-bg", "rgba(255, 255, 255, 0.05)");
    } else {
      // Colored Wash Themes (Blue, Green, Purple)
      root.style.setProperty("--bg", "#0a0a0a");
      root.style.setProperty("--text", "#f8f9fa");
      root.style.setProperty("--text-h", "#ffffff");
      root.style.setProperty("--text-dim", "rgba(255, 255, 255, 0.6)");
      root.style.setProperty("--heading-color", "var(--theme-color)");
      root.style.setProperty(
        "--heading-shadow",
        "2px 2px 0px rgba(0, 0, 0, 0.8)",
      );
      root.style.setProperty("--heading-stroke", "0.5px black");
      root.style.setProperty("--glass-bg", "rgba(255, 255, 255, 0.05)");
      root.style.setProperty("--glass-bg-hover", "rgba(0, 0, 0, 0.6)");
      root.style.setProperty("--glass-blur", "40px");
      root.style.setProperty("--glass-blur-hover", "60px");
      root.style.setProperty("--glass-border", `rgba(${rgb}, 0.3)`);
      root.style.setProperty("--glass-border-hover", `rgba(${rgb}, 0.3)`);
      root.style.setProperty("--glass-border-width", "1px");
      root.style.setProperty(
        "--glass-shadow",
        "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      );
      root.style.setProperty("--glass-glow", "none");
      root.style.setProperty("--btn-hover-bg", "var(--theme-color)");
      root.style.setProperty("--btn-hover-text", "#ffffff");
      root.style.setProperty("--input-bg", "rgba(255, 255, 255, 0.05)");
    }
  }, [themeColor]);

  useEffect(() => {
    if (isFontLocked) return;

    const timer = setInterval(() => {
      setCurrentFontIndex((prev) => (prev + 1) % activeFonts.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isFontLocked, activeFonts]);

  const toggleFontLock = () => setIsFontLocked(!isFontLocked);

  const setFontIndex = (index) => {
    setCurrentFontIndex(index);
    setIsFontLocked(true);
  };

  const nextColor = () => {
    setThemeColor((prev) => {
      const nextIdx =
        (colors.findIndex((c) => c.value === prev.value) + 1) % colors.length;
      return colors[nextIdx];
    });
  };

  const resetRetroDitherSettings = () => {
    setIsRetroDitherEnabled(defaultRetroDitherSettings.enabled);
    setRetroDitherStrength(defaultRetroDitherSettings.strength);
    setRetroDitherPixelSize(defaultRetroDitherSettings.pixelSize);
    setRetroDitherScanlines(defaultRetroDitherSettings.scanlines);
    setRetroDitherClickWave(defaultRetroDitherSettings.clickWave);
  };

  const activeFontFamily = isFontLocked
    ? activeFonts[currentFontIndex].fontname
    : "GrindyBrush";
  const activeFontScale = isFontLocked
    ? activeFonts[currentFontIndex].scale
    : activeFonts.find((f) => f.id === 4).scale;

  return (
    <ThemeContext.Provider
      value={{
        fonts: activeFonts,
        currentFont: activeFonts[currentFontIndex] || activeFonts[0],
        currentFontIndex,
        isFontLocked,
        setIsFontLocked,
        toggleFontLock,
        setFontIndex,
        isOverkillEnabled,
        setIsOverkillEnabled,
        colors,
        themeColor,
        nextColor,
        setThemeColor,
        isInstantReadabilityEnabled,
        setIsInstantReadabilityEnabled,
        isRetroDitherEnabled,
        setIsRetroDitherEnabled,
        retroDitherStrength,
        setRetroDitherStrength,
        retroDitherPixelSize,
        setRetroDitherPixelSize,
        retroDitherScanlines,
        setRetroDitherScanlines,
        retroDitherClickWave,
        setRetroDitherClickWave,
        resetRetroDitherSettings,
        activeFontFamily,
        activeFontScale,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
