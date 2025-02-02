import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { PatientCalendar } from "./patient_calendar.jsx";

const specialties = [
  "Allergist",
  "Anesthesiologist",
  "Cardiologist",
  "Dentist",
  "Dermatologist",
  "Emergency",
  "Endocrinologist",
  "Gastroenterologist",
  "General",
  "Geneticist",
  "Geriatrician",
  "Gynecologist",
  "Hematologist",
  "Nephrologist",
  "Neurologist",
  "Oncologist",
  "Ophthalmologist",
  "Orthopedic",
  "Otolaryngologist",
  "Pathologist",
  "Pediatrician",
  "Psychiatrist",
  "Pulmonologist",
  "Radiologist",
  "Rheumatologist",
  "Surgeon",
  "Urologist"
];

const doctorsBySpecialty = {
  Allergist: [
    "Dr. Javier Gómez, Madrid, 28100",
    "Dr. Carla Ríos, Madrid, 28002",
    "Dr. Sergio Fernández, Madrid, 28083",
    "Dr. Lucía Navarro, Madrid, 28034",
  ],
  Anesthesiologist: [
    "Dr. Matías Soler, Madrid, 28055",
    "Dr. Elena Torres, Madrid, 28106",
    "Dr. Hugo Méndez, Madrid, 28077",
    "Dr. Patricia Vidal, Madrid, 28058",
  ],
  Cardiologist: [
    "Dr. Nicolás Herrera, Madrid, 28089",
    "Dr. Sofía Molina, Madrid, 28010",
    "Dr. Andrés Pérez, Madrid, 28089",
    "Dr. Claudia Ortega, Madrid, 28052",
  ],
  Dentist: [
    "Dr. Ricardo Álvarez, Madrid, 28089",
    "Dr. Mariana Guzmán, Madrid, 28014",
    "Dr. Federico León, Madrid, 28065",
    "Dr. Angela Salazar, Madrid, 28046",
  ],
  Dermatologist: [
    "Dr. Valeria Martínez, Madrid, 28017",
    "Dr. Fernando Castro, Madrid, 28089",
    "Dr. Beatriz López, Madrid, 28019",
    "Dr. Gabriel Sánchez, Madrid, 28089",
  ],
  Emergency: [
    "Dr. Mario Díaz, Madrid, 28089",
    "Dr. Ana Jiménez, Madrid, 28052",
    "Dr. Tomás Roldán, Madrid, 28023",
    "Dr. Camila Núñez, Madrid, 28089",
  ],
  Endocrinologist: [
    "Dr. Samuel Herrera, Madrid, 28025",
    "Dr. Elisa Cordero, Madrid, 28026",
    "Dr. Pablo Vega, Madrid, 28027",
    "Dr. Diana Paredes, Madrid, 28028",
  ],
  Gastroenterologist: [
    "Dr. Raúl Morales, Madrid, 28029",
    "Dr. Manuela Escobar, Madrid, 28030",
    "Dr. Esteban Reyes, Madrid, 28031",
    "Dr. Gloria Fuentes, Madrid, 28032",
  ],
  General: [
    "Dr. Santiago Rivas, Madrid, 28033",
    "Dr. Paula Medina, Madrid, 28034",
    "Dr. Ernesto Domínguez, Madrid, 28035",
    "Dr. Leticia Herrera, Madrid, 28036",
  ],
  Geneticist: [
    "Dr. Javier Peña, Madrid, 28053",
    "Dr. Lorena Ortega, Madrid, 28054",
    "Dr. Manuel Rivas, Madrid, 28055",
    "Dr. Beatriz Santos, Madrid, 28056",
  ],
  Geriatrician: [
    "Dr. Fernando Ruiz, Madrid, 28037",
    "Dr. Laura Suárez, Madrid, 28008",
    "Dr. Antonio Vargas, Madrid, 28089",
    "Dr. Teresa López, Madrid, 28040",
  ],
  Gynecologist: [
    "Dr. Marta Peña, Madrid, 28089",
    "Dr. Alicia Ramos, Madrid, 28042",
    "Dr. José Luis Torres, Madrid, 28037",
    "Dr. Silvia Gómez, Madrid, 28044",
  ],
  Hematologist: [
    "Dr. Jorge Molina, Madrid, 28045",
    "Dr. Clara Paredes, Madrid, 28037",
    "Dr. Daniel Ríos, Madrid, 28047",
    "Dr. Patricia Estévez, Madrid, 28037",
  ],
  Nephrologist: [
    "Dr. Felipe Muñoz, Madrid, 28037",
    "Dr. Natalia Herrera, Madrid, 28058",
    "Dr. Andrés Castro, Madrid, 28059",
    "Dr. Verónica López, Madrid, 28060",
  ],
  Neurologist: [
    "Dr. Ignacio Romero, Madrid, 28073",
    "Dr. Sofía Valdés, Madrid, 28037",
    "Dr. Luis Ortega, Madrid, 28075",
    "Dr. Carmen Ferrer, Madrid, 28037",
  ],
  Oncologist: [
    "Dr. Emilio Gutiérrez, Madrid, 28037",
    "Dr. Paula Montes, Madrid, 28078",
    "Dr. Jorge Salinas, Madrid, 28037",
    "Dr. Claudia Vega, Madrid, 28037",
  ],
  Ophthalmologist: [
    "Dr. Andrés Vázquez, Madrid, 28037",
    "Dr. Susana Gil, Madrid, 28086",
    "Dr. Ramón Medina, Madrid, 28087",
    "Dr. Natalia Fuentes, Madrid, 28037",
  ],
  Orthopedic: [
    "Dr. Ricardo Gómez, Madrid, 28089",
    "Dr. María López, Madrid, 28037",
    "Dr. Esteban Rojas, Madrid, 28091",
    "Dr. Julia Herrera, Madrid, 28092",
  ],
  Otolaryngologist: [
    "Dr. Daniel Ruiz, Madrid, 28093",
    "Dr. Andrea Pérez, Madrid, 28037",
    "Dr. Oscar Vega, Madrid, 28095",
    "Dr. Sandra Morales, Madrid, 28096",
  ],
  Pathologist: [
    "Dr. Roberto Fernández, Madrid, 28081",
    "Dr. Amelia Vargas, Madrid, 28037",
    "Dr. Tomás Aguilar, Madrid, 28083",
    "Dr. Lucía Márquez, Madrid, 28037",
  ],
  Pediatrician: [
    "Dr. Carla Romero, Madrid, 28097",
    "Dr. Luis Sanz, Madrid, 28037",
    "Dr. Rosa Medina, Madrid, 28099",
    "Dr. Hugo García, Madrid, 28037",
  ],
  Psychiatrist: [
    "Dr. Emilio Sánchez, Madrid, 28101",
    "Dr. Mariana Torres, Madrid, 28102",
    "Dr. Samuel Gómez, Madrid, 28103",
    "Dr. Patricia Rojas, Madrid, 28104",
  ],
  Pulmonologist: [
    "Dr. Ignacio Martínez, Madrid, 28037",
    "Dr. Teresa López, Madrid, 28106",
    "Dr. Antonio Fuentes, Madrid, 28037",
    "Dr. Camila Ortega, Madrid, 28108",
  ],
  Radiologist: [
    "Dr. Esteban Pérez, Madrid, 28109",
    "Dr. Ana Vargas, Madrid, 28110",
    "Dr. Fernando Salinas, Madrid, 28111",
    "Dr. Claudia Herrera, Madrid, 28112",
  ],
  Rheumatologist: [
    "Dr. Lucía Domínguez, Madrid, 28113",
    "Dr. Andrés Ríos, Madrid, 28114",
    "Dr. Beatriz Sanz, Madrid, 28115",
    "Dr. Javier Gómez, Madrid, 28116",
  ],
  Surgeon: [
    "Dr. Pablo Navarro, Madrid, 28117",
    "Dr. Laura Mendoza, Madrid, 28118",
    "Dr. Juana Vargas, Madrid, 28110",
    "Dr. Raul Salinas, Madrid, 28111",
  ],
  Urologist: [
    "Dr. Tomás Herrera, Madrid, 28119",
    "Dr. Adriana Ruiz, Madrid, 28120",
    "Dr. Ana Perez, Madrid, 28110",
    "Dr. Fernando Gomez, Madrid, 28111",
  ],
};

const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

export const Calendar = () => {
  const { store, actions } = useContext(Context);
  const [selectedSpecialtyIndex, setSelectedSpecialtyIndex] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedTime, setSelectedTime] = useState("09:00");

  useEffect(() => {
    if (actions.fetchAppointments) {
      actions.fetchAppointments();
    }
  }, [actions]);

  const handleCreateEvent = async () => {
    if (!selectedDoctor) {
      console.error("No doctor selected");
      return;
    }
    if (!selectedDate) {
      console.error("No date selected");
      return;
    }
    try {
      const appointmentData = {
        medico_id: selectedDoctor,
        appointment_date: selectedDate.toISOString().split("T")[0],
        appointment_time: selectedTime,
        notes: "Consulta médica",
      };
      await actions.createAppointment(appointmentData);
      setAppointments([...appointments, appointmentData]);
    } catch (error) {
      console.error("Error scheduling appointment:", error);
    }
  };

  const handleNext = () => {
    setSelectedSpecialtyIndex((prevIndex) => (prevIndex + 1) % specialties.length);
    setSelectedDoctor(null);
    setShowCalendar(false);
  };

  const handlePrevious = () => {
    setSelectedSpecialtyIndex((prevIndex) =>
      prevIndex === 0 ? specialties.length - 1 : prevIndex - 1
    );
    setSelectedDoctor(null);
    setShowCalendar(false);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowCalendar(true);
  };

  const handleDayClick = (day) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  const selectedSpecialty = specialties[selectedSpecialtyIndex];
  const doctors = doctorsBySpecialty[selectedSpecialty] || [];
  const today = new Date();
  const days = daysInMonth(today.getMonth() + 1, today.getFullYear());
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <>
      <div className="appointment-calendar-container mb-5 text-center">
        <div className="appointment-search-bar">
          <input
            type="text"
            className="appointment-search-input"
            placeholder="e.g. Madrid, Madrid"
          />
          <button className="appointment-search-button">Search</button>
        </div>

        <div className="appointment-carousel">
          <button className="appointment-carousel-arrow" onClick={handlePrevious}>
            &#8592;
          </button>
          <div className="appointment-carousel-item active">{selectedSpecialty}</div>
          <button className="appointment-carousel-arrow" onClick={handleNext}>
            &#8594;
          </button>
        </div>

        <div className="appointment-specialty-doctors ms-2">
          <ul>
            {doctors.map((doctor, index) => (
              <li
                key={index}
                className={`appointment-doctor-item ${selectedDoctor === doctor ? "selected" : ""
                  }`}
                onClick={() => handleSelectDoctor(doctor)}
              >
                {doctor}
              </li>
            ))}
          </ul>
        </div>

        {showCalendar && (
          <div className="appointment-calendar">
            <div className="appointment-calendar-grid">
              {weekDays.map((day, index) => (
                <div key={index} className="appointment-calendar-weekday">
                  {day}
                </div>
              ))}
              {Array.from({ length: days }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={`appointment-calendar-day ${selectedDate?.getDate() === day ? "selected" : ""
                    }`}
                  onClick={() => handleDayClick(day)}
                >
                  {day}
                </div>
              ))}
            </div>

            {selectedDate && (
              <div className="appointment-details-container">
                <p>
                  <strong>Date:</strong>{" "}
                  {selectedDate.toLocaleDateString("en-EN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="appointment-time-selector">
                  <label htmlFor="time">Time:</label>
                  <input
                    type="time"
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button
              className="appointment-schedule-button"
              onClick={handleCreateEvent}
            >
              Schedule
            </button>
          </div>
        )}

        {appointments.length > 0 && (
          <div className="appointment-list mt-3">
            {appointments.map((appointment, index) => (
              <p key={index} className="appointment-list-item">
                {`Appointment on ${appointment.appointment_date} at ${appointment.appointment_time} with ${appointment.medico_id}`}
              </p>
            ))}
          </div>
        )}
      </div>
      <PatientCalendar />
    </>
  );
};
