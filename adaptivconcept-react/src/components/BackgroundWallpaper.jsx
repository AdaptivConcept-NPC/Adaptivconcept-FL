import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const BackgroundWallpaper = () => {
  const { themeColor } = useTheme();
  const location = useLocation();
  
  const isResumePage = location.pathname === '/resume';
  
  // Wallpapers list for loop
  const loopWallpapers = [
    '/media/thabang_vector_wallpaper_1.png',
    '/media/thabang_vector_wallpaper_avatar.png',
    '/media/thabang_vector_wallpaper_3.png',
  ];

  // Specific static wallpaper for the resume page
  const resumeWallpaper = '/media/opportunity_board.png';

  const [currentIndex, setCurrentIndex] = useState(0);

  // Interval loop for non-resume pages
  useEffect(() => {
    if (isResumePage) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % loopWallpapers.length);
    }, 20000); // Crossfade every 20 seconds

    return () => clearInterval(interval);
  }, [isResumePage, loopWallpapers.length]);

  const getFilterString = () => {
    return themeColor.washType === 'none' 
      ? 'none' 
      : `${themeColor.washType !== 'none' ? 'grayscale(100%)' : ''} brightness(${
          themeColor.washType === 'light' ? '0.9' : 
          themeColor.washType === 'coal' ? '0.45' : '0.6'
        }) contrast(1.1)`;
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      {/* Loop Wallpapers */}
      {loopWallpapers.map((url, index) => {
        const isActive = !isResumePage && index === currentIndex;

        return (
          <div 
            key={url}
            className="absolute inset-0 object-cover transition-opacity duration-[2000ms] ease-in-out"
            style={{
              backgroundImage: `url(${url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              backgroundRepeat: 'no-repeat',
              opacity: isActive ? 1 : 0,
              filter: getFilterString(),
            }}
          />
        );
      })}

      {/* Resume Static Wallpaper */}
      <div 
        className={`absolute inset-0 object-cover transition-opacity duration-[2000ms] ease-in-out ${
          isResumePage ? 'animate-slow-zoom' : ''
        }`}
        style={{
          backgroundImage: `url(${resumeWallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          opacity: isResumePage ? 1 : 0,
          filter: getFilterString(),
        }}
      />
      
      {/* Solid Color Wash Overlay */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          themeColor.washType === 'white' || themeColor.washType === 'light' ? 'mix-blend-screen opacity-40' : 
          themeColor.washType === 'coal' || themeColor.washType === 'none' ? 'opacity-0' : 
          themeColor.washType === 'dark' ? 'mix-blend-multiply opacity-25' : 'opacity-0'
        }`}
        style={{
          backgroundColor: themeColor.value,
        }}
      />

      {/* Subtle darkening for content legibility - adjusted based on wash type */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${
          themeColor.washType === 'light' ? 'bg-white/10' : 
          themeColor.washType === 'white' ? 'bg-black/10' : 
          themeColor.washType === 'coal' || themeColor.washType === 'none' ? 'bg-transparent opacity-0' : 'bg-black/40'
        }`} 
      />
    </div>
  );
};

export default BackgroundWallpaper;
