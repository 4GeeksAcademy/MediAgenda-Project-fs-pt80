import React, { useState } from "react";
import "../../styles/BookAppointment.css";
import { DoctorCalendar } from "./doctor_calendar.jsx";

const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

export const BookAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedTime, setSelectedTime] = useState("09:00");

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const days = daysInMonth(currentMonth + 1, currentYear);

  const handleDayClick = (day) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  const handleSchedule = () => {
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("en-EN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      });
      const newAppointment = `${formattedDate} ${selectedTime}`;
      setAppointments([...appointments, newAppointment]);
    }
  };

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <>
      <h1 className="calendar-title text-start ms-5 ">Manage Availability</h1>
      
      <div className="calendar-container">

        {/* Calendario */}
        <div className="calendar">
          {weekDays.map((day, index) => (
            <div key={index} className="calendar-weekday">
              {day}
            </div>
          ))}
          {Array.from({ length: days }, (_, i) => i + 1).map((day) => (
            <div
              key={day}
              className={`calendar-day ${selectedDate?.getDate() === day ? "selected" : ""
                }`}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Detalles de la cita */}
        {selectedDate && (
          <div className="appointment-details">
            <p>
              <strong>Date:</strong>{" "}
              {selectedDate.toLocaleDateString("en-EN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="time-selector">
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

        {/* Lista de citas programadas */}
        <div className="appointments-list">
          {appointments.map((appointment, index) => (
            <p key={index} className="appointment-item">
              {appointment}
            </p>
          ))}
        </div>

        {/* Botón para agendar */}
        <button className="schedule-button" onClick={handleSchedule}>
          Schedule
        </button>
      </div>
      <DoctorCalendar />
    </>
  );
};



