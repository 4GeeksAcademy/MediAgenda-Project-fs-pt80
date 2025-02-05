import React from "react";
import logo_phone2 from "../../img/logo_phone2.png";

export const AboutUs = () => {
  return (
    <div className="about-us-container container-fluid">
      <div className="row justify-content-left align-items-left py-5">
        
        <div className="col-12 col-md-6 text-container">
          <p className="text">
            Our mission is to transform the medical practice management experience
            through accessible, efficient, and user-centric technology. We believe
            that health is a priority, and our system is designed to connect
            patients and medical professionals quickly and securely.
          </p>
          <p className="text mt-4">
            Our goal is to simplify administrative processes, such as scheduling
            appointments, consulting medical records, and communication between
            patients and doctors. All this with an intuitive interface that
            facilitates access to information and ensures a seamless experience
            for all users.
          </p>
          <p className="welcome-text mt-4 text-center text-md-start">
            Welcome to a new standard in medical practice management!
          </p>
        </div>

    
        <div className="col-12 col-md-6 d-flex justify-content-center mt-4 mt-md-0">
          <div className="image-container-about">
          <img
          src={logo_phone2}
          alt="App Mockup"
          className="img-fluid"
          />
          </div>
        </div>
        
      </div>
    </div>
  );
};

