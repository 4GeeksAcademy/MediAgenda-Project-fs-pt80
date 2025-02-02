import React from "react";
import group21Image from "../../img/laptop.png";
import image15 from "../../img/doctor9.png";
import image16 from "../../img/doctor8.png";
import image17 from "../../img/doctor10.png";
import DoctorCalendar from "../component/doctor_calendar.jsx";
import PatientCalendar from "../component/patient_calendar.jsx";



export const Home = () => {
  return (
    <div className="home_body">
      {/* Sección Principal */}
      <section className="hero-section">
      <div className="cuadrado"></div>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-7 col-lg-7">
              <div className="hero-text">
                <h1>Schedule your appointment easily</h1>
                <p>
                 We are here to make healthcare easier, because every visit counts and
                 every patient matters.
                </p>
                <div className="btn-appointment">
                 Take an Appointment <i className="fas fa-arrow-right"></i>
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

      {/* Sección "What do we do?" */}
      <section className="container py-5">
        <div className="row align-items-center what-we-do">
          <div className="col-md-4 text-md-start text-center">
            <h2>What do we do?</h2>
          </div>
          <div className="col-md-8 text-md-end text-center">
            <p>
               We developed a comprehensive solution to manage medical consultations
               efficiently and securely. We facilitate appointment scheduling, access
               to medical records, and communication between patients and doctors,
               optimizing administrative processes for clinics and offices.
            </p>
          </div>
        </div>
      </section> 

{/* Carrusel de Profesionales */}
<section className="professional-slide">
  <div id="professionalsCarousel" className="carousel slide" data-bs-ride="carousel">
    <div className="carousel-inner">
      {/* Primer Item */}
      <div className="carousel-item active">
        <div className="image-container">
          <img src={image15} className="d-block" alt="Doctor 1" />
        </div>
        <div className="carousel-caption">
          <h5>Dr. Jane Doe</h5>
          <p>Cardiology Specialist</p>
        </div>
      </div>
      
      {/* Segundo Item */}
      <div className="carousel-item">
        <div className="image-container">
          <img src={image16} className="d-block" alt="Doctor 2" />
        </div>
        <div className="carousel-caption">
          <h5>Dr. John Smith</h5>
          <p>Pediatric Expert</p>
        </div>
      </div>

      {/* Tercer Item */}
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

    {/* Controles */}
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

      {/* Sección "Find Your Doctor" */}
      <section className="find-doctor">
        <h2>Find Your Doctor</h2>
        <div className="search-bar">
          <input type="text" placeholder="Orangel Hernandez" className="search-input" />
          <button className="search-button"><i class="fa-solid fa-magnifying-glass custom-color"></i></button>
        </div>
      </section>

      {/* Sección "Medical Suggestions" */}
      <section className="medical-suggestions">
        <h2>Medical Suggestions</h2>
        <blockquote className="suggestion">
          <p>
            "Excess sodium can increase blood pressure, and high sugar intake can
            contribute to obesity and diabetes."
          </p>
          <p>By Dr. Smith</p>
        </blockquote>
      </section>
    </div>
  );
};
