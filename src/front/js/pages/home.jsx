import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import group21Image from "../../img/laptop.png";
import image15 from "../../img/doctor9.png";
import image16 from "../../img/doctor8.png";
import image17 from "../../img/doctor10.png";

export const Home = () => {
  const navigate = useNavigate();
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleRegister = () => {
    navigate("/register")
  } 
  const suggestions = [
    "Excess sodium can increase blood pressure, and high sugar intake can contribute to obesity and diabetes.",
    "Regular exercise can help prevent heart disease and other chronic illnesses.",
    "Drinking enough water each day is crucial for maintaining good health."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setSuggestionIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, suggestions.length]);

  return (
    <div className="home_body">

   

      <section className="hero-section">
        <div className="container container-first-section">
          <div className="row">
            <div className="col-sm-12 col-md-7 col-lg-7">
              <div className="hero-text">
                <h1 className="mb-5 text-start">Schedule your appointment easily</h1>
                <p className="mb-5 text-start">
                  We are here to make healthcare easier, because every visit counts and
                  every patient matters.
                </p>
                <div className="btn-appointment" onClick={handleRegister}>
                  <p className="mb-0">Take an Appointment</p>
                  <span className="fas fa-arrow-right"></span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-5 col-lg-5">
            <div className="hero-image d-flex">
              <img src={group21Image} alt="Laptop with calendar" />
            </div>

          </div>
        </div>


      </section>

     
      <section className="container">
        <div className="content-w-w-d">
          <div className="row align-items-center what-we-do">
            <div className="col-md-4 text-md-start text-center">
              <div>
                <h2>What do we do?</h2>
              </div>
            </div>
            <div className="col-sm-12 col-md-8 col-lg-8 col-xl-8">
              <div className="content-txt-w-w-d">
                <p className="big-text-what-we-do">
                  We developed a comprehensive solution to manage medical consultations
                  efficiently and securely. We facilitate appointment scheduling, access
                  to medical records, and communication between patients and doctors,
                  optimizing administrative processes for clinics and offices.
                </p>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      <section className="professional-slide">
        <div id="professionalsCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
         
            <div className="carousel-item active">
              <div className="image-container">
                <img src={image15} className="d-block" alt="Doctor 1" />
              </div>
              <div className="carousel-caption">
                <h5>Dr. Jane Doe</h5>
                <p className="text-speciality">Cardiology Specialist</p>
              </div>
            </div>

       
            <div className="carousel-item">
              <div className="image-container">
                <img src={image16} className="d-block" alt="Doctor 2" />
              </div>
              <div className="carousel-caption">
                <h5>Dr. John Smith</h5>
                <p>Pediatric Expert</p>
              </div>
            </div>

        
            <div className="carousel-item">
              <div className="image-container">
                <img src={image17} className="d-block" alt="Doctor 3" />
              </div>
              <div className="carousel-caption">
                <h5>Dr. Emily Brown</h5>
                <p>Dermatology Specialist</p>
              </div>
            </div>
          </div>

         
          <button className="carousel-control-prev" type="button" data-bs-target="#professionalsCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#professionalsCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>


      <section className="find-doctor py-5">
        <h2>Find Your Doctor</h2>
        <div className="search-bar">
          <input type="text" placeholder="Orangel Hernandez" className="search-input" />
          <button className="search-button" onClick={handleRegister}><i className="fa-solid fa-magnifying-glass custom-color"></i></button>
        </div>
      </section>

     
      <section className="medical-suggestions">
        <h2>Medical Suggestions</h2>
        <blockquote
          className="suggestion"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <p>{suggestions[suggestionIndex]}</p>
          <p className="doctor-h-name">By Dr. Smith</p>
        </blockquote>
      </section>
    </div>
  );
};
