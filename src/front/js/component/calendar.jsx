// import React, { useState, useEffect, useContext } from "react";
// import { Context } from "../store/appContext";
// import { PatientCalendar } from "./patient_calendar.jsx";
// // import { PatientCalendar } from "./patient_calendar.jsx";

// const specialties = [
//   "Allergist",
//   "Anesthesiologist",
//   "Cardiologist",
//   "Dentist",
//   "Dermatologist",
//   "Emergency",
//   "Endocrinologist",
//   "Gastroenterologist",
//   "General",
//   "Geneticist",
//   "Geriatrician",
//   "Gynecologist",
//   "Hematologist",
//   "Nephrologist",
//   "Neurologist",
//   "Oncologist",
//   "Ophthalmologist",
//   "Orthopedic",
//   "Otolaryngologist",
//   "Pathologist",
//   "Pediatrician",
//   "Psychiatrist",
//   "Pulmonologist",
//   "Radiologist",
//   "Rheumatologist",
//   "Surgeon",
//   "Urologist"
// ];

// const doctorsBySpecialty = {
//   Allergist: [
//     "Dr. Javier Gómez, Madrid, 28100",
//     "Dr. Carla Ríos, Madrid, 28002",
//     "Dr. Sergio Fernández, Madrid, 28083",
//     "Dr. Lucía Navarro, Madrid, 28034",
//   ],
//   Anesthesiologist: [
//     "Dr. Matías Soler, Madrid, 28055",
//     "Dr. Elena Torres, Madrid, 28106",
//     "Dr. Hugo Méndez, Madrid, 28077",
//     "Dr. Patricia Vidal, Madrid, 28058",
//   ],
//   Cardiologist: [
//     "Dr. Nicolás Herrera, Madrid, 28089",
//     "Dr. Sofía Molina, Madrid, 28010",
//     "Dr. Andrés Pérez, Madrid, 28089",
//     "Dr. Claudia Ortega, Madrid, 28052",
//   ],
//   Dentist: [
//     "Dr. Ricardo Álvarez, Madrid, 28089",
//     "Dr. Mariana Guzmán, Madrid, 28014",
//     "Dr. Federico León, Madrid, 28065",
//     "Dr. Angela Salazar, Madrid, 28046",
//   ],
//   Dermatologist: [
//     "Dr. Valeria Martínez, Madrid, 28017",
//     "Dr. Fernando Castro, Madrid, 28089",
//     "Dr. Beatriz López, Madrid, 28019",
//     "Dr. Gabriel Sánchez, Madrid, 28089",
//   ],
//   Emergency: [
//     "Dr. Mario Díaz, Madrid, 28089",
//     "Dr. Ana Jiménez, Madrid, 28052",
//     "Dr. Tomás Roldán, Madrid, 28023",
//     "Dr. Camila Núñez, Madrid, 28089",
//   ],
//   Endocrinologist: [
//     "Dr. Samuel Herrera, Madrid, 28025",
//     "Dr. Elisa Cordero, Madrid, 28026",
//     "Dr. Pablo Vega, Madrid, 28027",
//     "Dr. Diana Paredes, Madrid, 28028",
//   ],
//   Gastroenterologist: [
//     "Dr. Raúl Morales, Madrid, 28029",
//     "Dr. Manuela Escobar, Madrid, 28030",
//     "Dr. Esteban Reyes, Madrid, 28031",
//     "Dr. Gloria Fuentes, Madrid, 28032",
//   ],
//   General: [
//     "Dr. Santiago Rivas, Madrid, 28033",
//     "Dr. Paula Medina, Madrid, 28034",
//     "Dr. Ernesto Domínguez, Madrid, 28035",
//     "Dr. Leticia Herrera, Madrid, 28036",
//   ],
//   Geneticist: [
//     "Dr. Javier Peña, Madrid, 28053",
//     "Dr. Lorena Ortega, Madrid, 28054",
//     "Dr. Manuel Rivas, Madrid, 28055",
//     "Dr. Beatriz Santos, Madrid, 28056",
//   ],
//   Geriatrician: [
//     "Dr. Fernando Ruiz, Madrid, 28037",
//     "Dr. Laura Suárez, Madrid, 28008",
//     "Dr. Antonio Vargas, Madrid, 28089",
//     "Dr. Teresa López, Madrid, 28040",
//   ],
//   Gynecologist: [
//     "Dr. Marta Peña, Madrid, 28089",
//     "Dr. Alicia Ramos, Madrid, 28042",
//     "Dr. José Luis Torres, Madrid, 28037",
//     "Dr. Silvia Gómez, Madrid, 28044",
//   ],
//   Hematologist: [
//     "Dr. Jorge Molina, Madrid, 28045",
//     "Dr. Clara Paredes, Madrid, 28037",
//     "Dr. Daniel Ríos, Madrid, 28047",
//     "Dr. Patricia Estévez, Madrid, 28037",
//   ],
//   Nephrologist: [
//     "Dr. Felipe Muñoz, Madrid, 28037",
//     "Dr. Natalia Herrera, Madrid, 28058",
//     "Dr. Andrés Castro, Madrid, 28059",
//     "Dr. Verónica López, Madrid, 28060",
//   ],
//   Neurologist: [
//     "Dr. Ignacio Romero, Madrid, 28073",
//     "Dr. Sofía Valdés, Madrid, 28037",
//     "Dr. Luis Ortega, Madrid, 28075",
//     "Dr. Carmen Ferrer, Madrid, 28037",
//   ],
//   Oncologist: [
//     "Dr. Emilio Gutiérrez, Madrid, 28037",
//     "Dr. Paula Montes, Madrid, 28078",
//     "Dr. Jorge Salinas, Madrid, 28037",
//     "Dr. Claudia Vega, Madrid, 28037",
//   ],
//   Ophthalmologist: [
//     "Dr. Andrés Vázquez, Madrid, 28037",
//     "Dr. Susana Gil, Madrid, 28086",
//     "Dr. Ramón Medina, Madrid, 28087",
//     "Dr. Natalia Fuentes, Madrid, 28037",
//   ],
//   Orthopedic: [
//     "Dr. Ricardo Gómez, Madrid, 28089",
//     "Dr. María López, Madrid, 28037",
//     "Dr. Esteban Rojas, Madrid, 28091",
//     "Dr. Julia Herrera, Madrid, 28092",
//   ],
//   Otolaryngologist: [
//     "Dr. Daniel Ruiz, Madrid, 28093",
//     "Dr. Andrea Pérez, Madrid, 28037",
//     "Dr. Oscar Vega, Madrid, 28095",
//     "Dr. Sandra Morales, Madrid, 28096",
//   ],
//   Pathologist: [
//     "Dr. Roberto Fernández, Madrid, 28081",
//     "Dr. Amelia Vargas, Madrid, 28037",
//     "Dr. Tomás Aguilar, Madrid, 28083",
//     "Dr. Lucía Márquez, Madrid, 28037",
//   ],
//   Pediatrician: [
//     "Dr. Carla Romero, Madrid, 28097",
//     "Dr. Luis Sanz, Madrid, 28037",
//     "Dr. Rosa Medina, Madrid, 28099",
//     "Dr. Hugo García, Madrid, 28037",
//   ],
//   Psychiatrist: [
//     "Dr. Emilio Sánchez, Madrid, 28101",
//     "Dr. Mariana Torres, Madrid, 28102",
//     "Dr. Samuel Gómez, Madrid, 28103",
//     "Dr. Patricia Rojas, Madrid, 28104",
//   ],
//   Pulmonologist: [
//     "Dr. Ignacio Martínez, Madrid, 28037",
//     "Dr. Teresa López, Madrid, 28106",
//     "Dr. Antonio Fuentes, Madrid, 28037",
//     "Dr. Camila Ortega, Madrid, 28108",
//   ],
//   Radiologist: [
//     "Dr. Esteban Pérez, Madrid, 28109",
//     "Dr. Ana Vargas, Madrid, 28110",
//     "Dr. Fernando Salinas, Madrid, 28111",
//     "Dr. Claudia Herrera, Madrid, 28112",
//   ],
//   Rheumatologist: [
//     "Dr. Lucía Domínguez, Madrid, 28113",
//     "Dr. Andrés Ríos, Madrid, 28114",
//     "Dr. Beatriz Sanz, Madrid, 28115",
//     "Dr. Javier Gómez, Madrid, 28116",
//   ],
//   Surgeon: [
//     "Dr. Pablo Navarro, Madrid, 28117",
//     "Dr. Laura Mendoza, Madrid, 28118",
//     "Dr. Juana Vargas, Madrid, 28110",
//     "Dr. Raul Salinas, Madrid, 28111",
//   ],
//   Urologist: [
//     "Dr. Tomás Herrera, Madrid, 28119",
//     "Dr. Adriana Ruiz, Madrid, 28120",
//     "Dr. Ana Perez, Madrid, 28110",
//     "Dr. Fernando Gomez, Madrid, 28111",
//   ],
// };

// const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

// export const Calendar = () => {
//   const { store, actions } = useContext(Context);
//   const [selectedSpecialtyIndex, setSelectedSpecialtyIndex] = useState(0);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [selectedTime, setSelectedTime] = useState("09:00");

//   useEffect(() => {
//     if (actions.fetchAppointments) {
//       actions.fetchAppointments();
//     }
//   }, [actions]);

//   const handleCreateEvent = async () => {
//     if (!selectedDoctor) {
//       console.error("No doctor selected");
//       return;
//     }
//     if (!selectedDate) {
//       console.error("No date selected");
//       return;
//     }
//     try {
//       const appointmentData = {
//         medico_id: selectedDoctor,
//         appointment_date: selectedDate.toISOString().split("T")[0],
//         appointment_time: selectedTime,
//         notes: "Consulta médica",
//       };
//       await actions.createAppointment(appointmentData);
//       setAppointments([...appointments, appointmentData]);
//     } catch (error) {
//       console.error("Error scheduling appointment:", error);
//     }
//   };

//   const handleNext = () => {
//     setSelectedSpecialtyIndex((prevIndex) => (prevIndex + 1) % specialties.length);
//     setSelectedDoctor(null);
//     setShowCalendar(false);
//   };

//   const handlePrevious = () => {
//     setSelectedSpecialtyIndex((prevIndex) =>
//       prevIndex === 0 ? specialties.length - 1 : prevIndex - 1
//     );
//     setSelectedDoctor(null);
//     setShowCalendar(false);
//   };

//   const handleSelectDoctor = (doctor) => {
//     setSelectedDoctor(doctor);
//     setShowCalendar(true);
//   };

//   const handleDayClick = (day) => {
//     const today = new Date();
//     const currentMonth = today.getMonth();
//     const currentYear = today.getFullYear();
//     setSelectedDate(new Date(currentYear, currentMonth, day));
//   };

//   const selectedSpecialty = specialties[selectedSpecialtyIndex];
//   const doctors = doctorsBySpecialty[selectedSpecialty] || [];
//   const today = new Date();
//   const days = daysInMonth(today.getMonth() + 1, today.getFullYear());
//   const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

//   return (
//     <>
//       <div className="appointment-calendar-container mb-5 text-center">
//         <div className="appointment-search-bar">
//           <input
//             type="text"
//             className="appointment-search-input"
//             placeholder="e.g. Madrid, Madrid"
//           />
//           <button className="appointment-search-button">Search</button>
//         </div>

//         <div className="appointment-carousel">
//           <button className="appointment-carousel-arrow" onClick={handlePrevious}>
//             &#8592;
//           </button>
//           <div className="appointment-carousel-item active">{selectedSpecialty}</div>
//           <button className="appointment-carousel-arrow" onClick={handleNext}>
//             &#8594;
//           </button>
//         </div>

//         <div className="appointment-specialty-doctors ms-2">
//           <ul>
//             {doctors.map((doctor, index) => (
//               <li
//                 key={index}
//                 className={`appointment-doctor-item ${selectedDoctor === doctor ? "selected" : ""
//                   }`}
//                 onClick={() => handleSelectDoctor(doctor)}
//               >
//                 {doctor}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {showCalendar && (
//           <div className="appointment-calendar">
//             <div className="appointment-calendar-grid">
//               {weekDays.map((day, index) => (
//                 <div key={index} className="appointment-calendar-weekday">
//                   {day}
//                 </div>
//               ))}
//               {Array.from({ length: days }, (_, i) => i + 1).map((day) => (
//                 <div
//                   key={day}
//                   className={`appointment-calendar-day ${selectedDate?.getDate() === day ? "selected" : ""
//                     }`}
//                   onClick={() => handleDayClick(day)}
//                 >
//                   {day}
//                 </div>
//               ))}
//             </div>

//             {selectedDate && (
//               <div className="appointment-details-container">
//                 <p>
//                   <strong>Date:</strong>{" "}
//                   {selectedDate.toLocaleDateString("en-EN", {
//                     day: "2-digit",
//                     month: "long",
//                     year: "numeric",
//                   })}
//                 </p>
//                 <div className="appointment-time-selector">
//                   <label htmlFor="time">Time:</label>
//                   <input
//                     type="time"
//                     id="time"
//                     value={selectedTime}
//                     onChange={(e) => setSelectedTime(e.target.value)}
//                   />
//                 </div>
//               </div>
//             )}

//             <button
//               className="appointment-schedule-button"
//               onClick={handleCreateEvent}
//             >
//               Schedule
//             </button>
//           </div>
//         )}

//         {appointments.length > 0 && (
//           <div className="appointment-list mt-3">
//             {appointments.map((appointment, index) => (
//               <p key={index} className="appointment-list-item">
//                 {`Appointment on ${appointment.appointment_date} at ${appointment.appointment_time} with ${appointment.medico_id}`}
//               </p>
//             ))}
//           </div>
//         )}
//       </div>

//     </>
//   );
// };
// import React, { useEffect, useContext } from "react";
// import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { Context } from "../store/appContext";
// import { signInWithGoogle } from "../component/gapi_auth.jsx";

// const localizer = momentLocalizer(moment);

// export const Calendar = () => {
//     const { store, actions } = useContext(Context);

//     useEffect(() => {
//         if (store.googleAccessToken && store.token) {
//             actions.fetchAppointments();
//         }
//     }, [store.googleAccessToken, store.token]);

//     useEffect(() => {
//         if (store.token) {
//             actions.fetchDoctors();
//         }
//     }, [store.token]);

//     useEffect(() => {
//         if (store.selectedDoctor) {
//             console.log("🔄 Cargando disponibilidad para el médico ID:", store.selectedDoctor);
//             actions.fetchAvailability(store.selectedDoctor);
//         }
//     }, [store.selectedDoctor]);

//     const handleGoogleLogin = async () => {
//         const googleToken = await signInWithGoogle();
//         if (googleToken) {
//             actions.saveGoogleToken(googleToken);
//             actions.fetchAppointments();
//             actions.fetchAvailability();
//         }
//     };

//     const handleGoogleLogout = () => {
//         actions.googleLogOut();
//     };
//     const availableSlots = store.availability.map(slot => ({
//         id: slot.id,
//         title: "Disponible",
//         start: new Date(`${slot.fecha}T${slot.hora_inicio}`),
//         end: new Date(`${slot.fecha}T${slot.hora_final}`),
//         backgroundColor: "green", 
//     }));

//     const handleSelectSlot = ({ start }) => {
//         actions.setSelectedDate(moment(start).format("YYYY-MM-DD"));
//         actions.setShowForm(true);
//     };

//     const handleReserve = async (event) => {
//         event.preventDefault();
//         if (!store.selectedTime || !store.selectedDoctor) {
//             alert("Selecciona una hora y un médico.");
//             return;
//         }

//         const appointmentData = {
//             appointment_date: store.selectedDate,
//             appointment_time: store.selectedTime,
//             medico_id: store.selectedDoctor,
//             access_token: store.googleAccessToken,
//             estado: "confirmada"
//         };

//         await actions.createAppointment(appointmentData);
//         actions.setShowForm(false);
//     };

//     const handleSelectEvent = async (event) => {
//         if (event.type === "appointment") {
//             const isConfirmed = window.confirm("¿Quieres cancelar esta cita?");
//             if (!isConfirmed) return;
//             await actions.cancelAppointment(event.id);
//         }
//     };

//     const events = [
//         ...store.appointments.map(appt => ({
//             id: appt.google_event_id,
//             title: appt.doctorName || "Cita Médica",
//             start: new Date(appt.appointment_date + "T" + appt.appointment_time),
//             end: new Date(appt.appointment_date + "T" + appt.appointment_time),
//             backgroundColor: "blue", // 🔹 Citas en azul
//         })),
//         ...availableSlots, // 🔹 Agregar la disponibilidad del médico al calendario
//     ];

//     return (
//         <div className="container mt-4">
//             <h2 className="text-center mb-4">Calendario de Citas</h2>

//             {!store.googleAccessToken ? (
//                 <div className="alert alert-warning text-center">
//                     <p>Debes iniciar sesión con Google para ver tu calendario.</p>
//                     <button className="btn btn-primary" onClick={handleGoogleLogin}>
//                         Iniciar con Google
//                     </button>
//                 </div>
//             ) : (
//                 <>
//                     <button className="btn btn-danger mb-3" onClick={handleGoogleLogout}>
//                         Cerrar Sesión en Google
//                     </button>

//                     {store.role === "paciente" && (
//                         <div className="mb-3">
//                             <label className="form-label">Selecciona un Médico:</label>
//                             <select
//                                 className="form-control"
//                                 value={store.selectedDoctor || ""}
//                                 onChange={(e) => actions.setSelectedDoctor(e.target.value)}
//                             >
//                                 <option value="">Seleccione un médico</option>
//                                 {store.doctors.length > 0 ? (
//                                     store.doctors.map((doctor) => (
//                                         <option key={doctor.id} value={doctor.id}>
//                                             {doctor.nombre} {doctor.apellido} - {doctor.especialidad}
//                                         </option>
//                                     ))
//                                 ) : (
//                                     <option disabled>Cargando médicos...</option>
//                                 )}
//                             </select>
//                         </div>
//                     )}

//                     <BigCalendar
//                         localizer={localizer}
//                         events={events}
//                         startAccessor="start"
//                         endAccessor="end"
//                         style={{ height: 500 }}
//                         selectable
//                         onSelectSlot={handleSelectSlot}
//                         onSelectEvent={handleSelectEvent}
//                     />

//                     {store.showForm && store.role === "paciente" && (
//                         <form onSubmit={handleReserve} className="mt-4 p-4 border rounded">
//                             <h4>Reservar Cita para {store.selectedDate}</h4>
//                             <label className="form-label">Selecciona la Hora:</label>
//                             <input
//                                 type="time"
//                                 className="form-control"
//                                 value={store.selectedTime}
//                                 onChange={(e) => actions.setSelectedTime(e.target.value)}
//                                 required
//                             />
//                             <button type="submit" className="btn btn-success mt-3">
//                                 Reservar Cita
//                             </button>
//                         </form>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };
// import React, { useEffect, useContext, useState } from "react";
// import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { Context } from "../store/appContext";
// import { signInWithGoogle } from "../component/gapi_auth.jsx";


// const localizer = momentLocalizer(moment);

// export const Calendar = () => {
//     const { store, actions } = useContext(Context);
//     const [hoveredDoctor, setHoveredDoctor] = useState(null);

//     useEffect(() => {
//         if (store.token) actions.fetchDoctors();
//     }, [store.token]);

//     useEffect(() => {
//         if (store.selectedDoctor) actions.fetchAvailability(store.selectedDoctor);
//     }, [store.selectedDoctor]);

//     const handleGoogleLogin = async () => {
//         const googleToken = await signInWithGoogle();
//         if (googleToken) {
//             actions.saveGoogleToken(googleToken);
//             actions.fetchAppointments();
//             actions.fetchAvailability(store.selectedDoctor);
//         }
//     };

//     const handleGoogleLogout = () => actions.googleLogOut();

//     const handleSelectSlot = ({ start }) => {
//         actions.setSelectedDate(moment(start).format("YYYY-MM-DD"));
//         actions.setShowForm(true);
//     };

//     const handleReserve = async (event) => {
//         event.preventDefault();
//         if (!store.selectedTime || !store.selectedDoctor) {
//             alert("Selecciona una hora y un médico.");
//             return;
//         }

//         await actions.createAppointment({
//             appointment_date: store.selectedDate,
//             appointment_time: store.selectedTime,
//             medico_id: store.selectedDoctor,
//             access_token: store.googleAccessToken,
//             estado: "confirmada"
//         });
//         actions.setShowForm(false);
//     };

//     const events = [
//         ...store.appointments.map(appt => ({
//             id: appt.google_event_id,
//             title: appt.doctorName || "Cita Médica",
//             start: new Date(appt.appointment_date + "T" + appt.appointment_time),
//             end: new Date(appt.appointment_date + "T" + appt.appointment_time),
//         })),
//         ...store.availability.map(slot => ({
//             id: slot.id,
//             title: "Disponible",
//             start: new Date(`${slot.fecha}T${slot.hora_inicio}`),
//             end: new Date(`${slot.fecha}T${slot.hora_final}`),
//         }))
//     ];

//     return (
//         <div className="appointment-calendar-container">
//             {!store.googleAccessToken ? (
//                 <div className="alert text-center">
//                     <p>Inicia sesión con Google para ver tu calendario.</p>
//                     <button className="appointment-schedule-button" onClick={handleGoogleLogin}>
//                         Iniciar con Google
//                     </button>
//                 </div>
//             ) : (
//                 <>
//                     <button className="appointment-schedule-button" onClick={handleGoogleLogout}>
//                         Cerrar Sesión en Google
//                     </button>
//                     <div className="appointment-carousel">
//                         <button className="appointment-carousel-arrow" onClick={() => actions.setSelectedSpeciality(-1)}>
//                             &#8592;
//                         </button>
//                         <div className="appointment-carousel-item">{store.selectedSpeciality || "Selecciona una especialidad"}</div>
//                         <button className="appointment-carousel-arrow" onClick={() => actions.setSelectedSpeciality(1)}>
//                             &#8594;
//                         </button>
//                     </div>
//                     <div className="appointment-specialty-doctors">
//                         {store.doctors
//                             .filter(doc => doc.especialidades === store.selectedSpeciality)
//                             .map(doctor => (
//                                 <button
//                                     key={doctor.id}
//                                     className={`appointment-doctor-item ${store.selectedDoctor === doctor.id ? "selected" : ""}`}
//                                     onClick={() => actions.setSelectedDoctor(doctor.id)}
//                                     onMouseEnter={() => setHoveredDoctor(doctor)}
//                                     onMouseLeave={() => setHoveredDoctor(null)}
//                                 >
//                                     {doctor.nombre} {doctor.apellido}
//                                     {hoveredDoctor && hoveredDoctor.id === doctor.id && (
//                                         <span className="tooltip">{doctor.clinica}</span>
//                                     )}
//                                 </button>
//                             ))}
//                     </div>
//                     <BigCalendar
//                         localizer={localizer}
//                         events={events}
//                         startAccessor="start"
//                         endAccessor="end"
//                         style={{ height: 500 }}
//                         selectable
//                         onSelectSlot={handleSelectSlot}
//                     />
//                     {store.showForm && (
//                         <form onSubmit={handleReserve} className="appointment-form">
//                             <h4>Reservar Cita para {store.selectedDate}</h4>
//                             <input
//                                 type="time"
//                                 value={store.selectedTime}
//                                 onChange={(e) => actions.setSelectedTime(e.target.value)}
//                                 required
//                             />
//                             <button type="submit" className="appointment-schedule-button">
//                                 Schedule
//                             </button>
//                         </form>
//                     )}
//                     <div className="appointment-list">
//                         {store.appointments.map(appt => (
//                             <div key={appt.google_event_id} className="appointment-list-item">
//                                 {appt.doctorName} - {appt.appointment_date} {appt.appointment_time}
//                             </div>
//                         ))}
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };
import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/BookAppointment.css";
import moment from "moment";

export const Calendar = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (store.selectedDoctor) {
            actions.fetchAvailability(store.selectedDoctor);
        }
    }, [store.selectedDoctor]);

    const handleSelectDay = (day) => {
        actions.setSelectedDate(moment().format(`YYYY-MM-${day < 10 ? `0${day}` : day}`));
        actions.setShowForm(true);
    };

    const handleReserveAppointment = async (event) => {
        event.preventDefault();
        if (!store.selectedTime || !store.selectedDoctor) {
            alert("Selecciona una hora y un doctor antes de agendar la cita.");
            return;
        }

        const appointmentData = {
            appointment_date: store.selectedDate,
            appointment_time: store.selectedTime,
            medico_id: store.selectedDoctor,
            paciente_id: store.user.id,
            estado: "confirmada"
        };

        await actions.createAppointment(appointmentData);
        actions.setShowForm(false);
    };

    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    return (
        <>
            <div className="content-availa-section">
                <h1 className="calendar-title text-start ms-5">Schedule Appointment</h1>
                <div className="calendar-container">
                    {/* Calendario */}
                    <div className="calendar">
                        {weekDays.map((day, index) => (
                            <div key={index} className="calendar-weekday">{day}</div>
                        ))}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                            <div
                                key={day}
                                className={`calendar-day ${store.selectedDate?.endsWith(`-${day < 10 ? `0${day}` : day}`) ? "selected" : ""}`}
                                onClick={() => handleSelectDay(day)}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Formulario para reservar cita */}
                    {store.showForm && (
                        <form onSubmit={handleReserveAppointment} className="appointment-details">
                            <p>Date: {store.selectedDate}</p>
                            <div className="time-selector">
                                <label>Time:</label>
                                <input
                                    type="time"
                                    value={store.selectedTime || ""}
                                    onChange={(e) => actions.setSelectedTime(e.target.value)}
                                    className="me-2"
                                    required
                                />
                            </div>
                            <button type="submit" className="schedule-button">Schedule</button>
                        </form>
                    )}

                    {/* Lista de citas */}
                    <div className="appointments-list">
                        {store.appointments.length > 0 ? (
                            store.appointments.map((appt) => (
                                <p key={appt.id} className="appointment-item">
                                    {appt.appointment_date} {appt.appointment_time} - with Dr. {appt.doctorName}
                                </p>
                            ))
                        ) : (
                            <p className="no-appointment-msg">No appointments scheduled</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
