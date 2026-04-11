import React from 'react';

const BackgroundVideo = () => {
  return (
    <video autoPlay muted loop id="bgVideo">
      <source src="/media/adaptivconcept_fl_bgvid_2.mp4" type="video/mp4" />
    </video>
  );
};

export default BackgroundVideo;