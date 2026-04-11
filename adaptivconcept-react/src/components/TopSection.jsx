import React from 'react';

const TopSection = () => {
  return (
    <div className="blank-window white-grad-btm" style={{position: 'relative', zIndex: 2}}>
      <div className="blank-window d-flex align-items-end justify-content-center pb-5" style={{color: 'rgb(255, 55, 21)'}}>
        <div className="d-grid gap-2 text-center">
          <p className="m-0 fs-5 be-vietnam-pro-font fw-bold px-2">
            We are making changes to our brand & website.
          </p>
          <span 
            className="material-icons material-icons-round" 
            style={{fontSize: '40px !important'}}
          >
            keyboard_arrow_down
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopSection;