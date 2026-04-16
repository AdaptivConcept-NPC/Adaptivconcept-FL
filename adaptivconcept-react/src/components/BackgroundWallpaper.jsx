import React from 'react';
import { useTheme } from '../context/ThemeContext';

const BackgroundWallpaper = ({ imageUrl }) => {
  const { themeColor } = useTheme();

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      {/* Base Image with Grayscale Filter */}
      <div 
        className="absolute inset-0 object-cover transition-all duration-1000"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: themeColor.washType === 'none' 
            ? 'none' 
            : `${themeColor.washType !== 'none' ? 'grayscale(100%)' : ''} brightness(0.6) contrast(1.1)`,
        }}


      />
      
      {/* Solid Color Wash Overlay */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          themeColor.washType === 'white' || themeColor.washType === 'light' ? 'mix-blend-screen opacity-40' : 
          themeColor.washType === 'dark' || themeColor.washType === 'coal' ? 'mix-blend-multiply opacity-25' : 'opacity-0'
        }`}
        style={{
          backgroundColor: themeColor.value,
        }}
      />

      {/* Subtle darkening for content legibility - adjusted based on wash type */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${
          themeColor.washType === 'light' ? 'bg-white/10' : 
          themeColor.washType === 'white' ? 'bg-black/20' : 
          themeColor.washType === 'coal' ? 'bg-black/20' :
          themeColor.washType === 'none' ? 'bg-transparent' : 'bg-black/40'
        }`} 
      />


    </div>
  );
};

export default BackgroundWallpaper;

