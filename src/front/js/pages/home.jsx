import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css"
import { Calendly } from "../component/Calendly.jsx";


export const Home = () => {
  return (
    <div className="home_body">
      //Cabecera

      <Calendly />

      <header className="home-header">
        <div className="logo">MEDIAGENDA</div>
        <nav className="nav-menu">
          <a href="#about-us">About us</a>
          <a href="#support">Support</a>
          <button className="btn-login">Login</button>
          <button className="btn-register">Register</button>
        </nav>
      </header>

      //Sección Principal
      <section className="hero-section">
        <div className="hero-text">
          <h1>Schedule your appointment easily</h1>
          <p>We are here to make healthcare easier, because every visit counts and every patient matters.</p>
          <button className="btn-appointment">Take an Appointment</button>
        </div>
        <div className="hero-image">
          <img src="/path-to-your-image/hero-laptop.png" alt="Laptop with calendar" />
        </div>
      </section>

      //Sección "What do we do?"
      <section className="what-we-do" id="about-us">
        <h2>What do we do?</h2>
        <p>
          We developed a comprehensive solution to manage medical consultations efficiently and securely. 
          We facilitate appointment scheduling, access to medical records, and communication between patients 
          and doctors, optimizing administrative processes for clinics and offices.
        </p>
      </section>

      //Carrusel de Profesionales
      <section className="professional-slide">
        <h2>Our Professionals</h2>
        <div className="carousel">
          <button className="carousel-btn prev">{"<"}</button>
          <div className="carousel-items">
            <div className="carousel-item">
              <img src="/path-to-your-image/doctor1.png" alt="Doctor 1" />
              <p>Dr. Jane Doe</p>
            </div>
            <div className="carousel-item">
              <img src="/path-to-your-image/doctor2.png" alt="Doctor 2" />
              <p>Dr. John Smith</p>
            </div>
            <div className="carousel-item">
              <img src="/path-to-your-image/doctor3.png" alt="Doctor 3" />
              <p>Dr. Emily Brown</p>
            </div>
          </div>
          <button className="carousel-btn next">{">"}</button>
        </div>
      </section>

      //Sección "Find Your Doctor"
      <section className="find-doctor">
        <h2>Find Your Doctor</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Orangel Hernandez"
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
      </section>

      //Sección "Medical Suggestions"
      <section className="medical-suggestions">
        <h2>Medical Suggestions</h2>
        <blockquote className="suggestion">
          <p>
            "Excess sodium can increase blood pressure, and high sugar intake 
            can contribute to obesity and diabetes."
          </p>
          <footer>By Dr. Smith</footer>
        </blockquote>
      </section>
    </div>
  );
};
