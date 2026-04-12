import React from 'react';

const BackgroundWallpaper = ({ imageUrl }) => {
  return (
    <div 
      className="fixed top-0 left-0 w-full h-full -z-10 object-cover"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
};

export default BackgroundWallpaper;
