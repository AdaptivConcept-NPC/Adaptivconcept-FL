import React from 'react';

const PlatformLogos = () => {
  const gotoLink = (link) => {
    window.location.href = `https://${link}`;
  };

  return (
    <>
      <div className="row align-items-center bg-white py-4 shadow" style={{borderRadius: '15px'}}>
        <div className="col-md-3 py-2 text-center">
          <img 
            src="/media/Fiverr_Logo-3370437793.png" 
            className="img-fluid icons-transform" 
            style={{maxHeight: '150px', cursor: 'pointer'}} 
            alt="Fiverr logo" 
            onClick={() => gotoLink('www.fiverr.com/')}
          />
        </div>
        <div className="col-md py-2 text-center">
          <img 
            src="/media/Freelancer_logo-929054186.png" 
            className="img-fluid icons-transform" 
            style={{maxHeight: '100px', cursor: 'pointer'}} 
            alt="Freelancer logo" 
            onClick={() => gotoLink('www.freelancer.com/')}
          />
        </div>
        <div className="col-md py-2 text-center">
          <img 
            src="/media/upwork-logo-png-transparent-3390692246.png"
            className="img-fluid icons-transform" 
            style={{maxHeight: '80px', cursor: 'pointer'}}
            alt="Upwork logo" 
            onClick={() => gotoLink('www.upwork.com/')}
          />
        </div>
      </div>
      <p className="text-center">
        <small className="text-white">
          The above logo's / trademarks are the intellectual property of
          their respective holders. Please click the logo's to visit the respective websites.
        </small>
      </p>
    </>
  );
};

export default PlatformLogos;