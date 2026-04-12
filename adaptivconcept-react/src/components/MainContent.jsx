import React from 'react';
import PlatformLogos from './PlatformLogos';

const MainContent = () => {
  const gotoLink = (link) => {
    window.location.href = `https://${link}`;
  };

  return (
    <div className="content">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-3 py-4">
            <div className="text-center">
              <span 
                className="material-icons material-icons-round bg-white p-5 rounded-circle shadow"
                style={{fontSize: '160px !important', color: 'rgb(255, 55, 21)'}}
              >
                tips_and_updates
              </span>
            </div>
          </div>
          <div className="col-md-9">
            <div className="container">
              <h1 className="poppins-font">We are going into Freelancing!</h1>
              <p className="be-vietnam-pro-font">
                In our <a href="https://adaptivconcept.co.za/blog/change-of-strategy-2023/" className="fw-bold">Public Letter
                posted on 11 January 2023</a>, we provided insight into how the first year
                of Project.Adapt 2022 went and it was unfortunately not successfull.
                We have realized that we need to change our strategy for the 2023/24 financial year in order
                to effectively accomplish the tasks we set out to do
                and we need to find new ways of financing the projects we have inititated and to build
                the team we need to complete the projects as well as secure
                them and be able to effectively maintain them in the future.
              </p>

              <div className="d-grid my-4">
                <p className="be-vietnam-pro-font">
                  Click the button below to read the Public letter on our blog.
                </p>
                <button 
                  type="button" 
                  className="my-4 shadow" 
                  id="gotoWebsite"
                  onClick={() => gotoLink('adaptivconcept.co.za/blog/change-of-strategy-2023/')}
                >
                  <span className="material-icons material-icons-round align-middle">history_edu</span>
                  <span className="align-middle"> Change of Strategy for AdaptivConcept™ NPC and Project.Adapt
                    for 2023 going forward.</span>
                </button>
              </div>

              <hr className="text-white" />

              <p className="be-vietnam-pro-font mt-4 fs-5">
                We will be offering services on these three major platforms:
              </p>

              <PlatformLogos />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;