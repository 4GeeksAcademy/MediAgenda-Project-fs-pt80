import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
// import "../../styles/BookAppointment.css";
import moment from "moment";
import { signInWithGoogle } from "../component/gapi_auth.jsx";

export const Calendar = () => {
    const { store, actions } = useContext(Context);
    
    useEffect(() => {
        actions.fetchDoctors();
    }, []);

    useEffect(() => {
        if (store.selectedDoctor) {
            actions.fetchAvailability(store.selectedDoctor);
        }
    }, [store.selectedDoctor]);

    const handleGoogleLogin = async () => {
        const googleToken = await signInWithGoogle();
        if (googleToken) {
            actions.saveGoogleToken(googleToken);
            actions.fetchAppointments();
        }
    };

    const handleGoogleLogout = () => {
        actions.googleLogOut();
    };

    const handlePrevSpeciality = () => {
        actions.setPreviousSpeciality();
    };

    const handleNextSpeciality = () => {
        actions.setNextSpeciality();
    };

    const handleSelectDoctor = (doctorId) => {
        actions.setSelectedDoctor(doctorId);
    };

    const handleSelectDay = (date) => {
        actions.setSelectedDate(date);
    };

    const handleReserveAppointment = async (time) => {
        if (!store.selectedDoctor || !store.selectedDate || !store.user) {
            alert("Selecciona un médico y una fecha antes de agendar la cita.");
            return;
        }
        const appointmentData = {
            appointment_date: store.selectedDate,
            appointment_time: time,
            medico_id: store.selectedDoctor,
            paciente_id: store.user.id,
            estado: "confirmada"
        };
        await actions.createAppointment(appointmentData);
    };

    const handleCancelAppointment = async (eventId) => {
        await actions.cancelAppointment(eventId);
    };

    return (
        <>
            <div className="content-availa-section">
                <h1 className="calendar-title text-start ms-5">Schedule Appointment</h1>
                {!store.googleAccessToken ? (
                    <button className="schedule-button" onClick={handleGoogleLogin}>Sign in with Google</button>
                ) : (
                    <button className="schedule-button logout" onClick={handleGoogleLogout}>Logout</button>
                )}
                
                <div className="appointment-carousel">
                    <button className="appointment-carousel-arrow" onClick={handlePrevSpeciality}>&#8592;</button>
                    <div className="appointment-carousel-item active">{store.selectedSpeciality}</div>
                    <button className="appointment-carousel-arrow" onClick={handleNextSpeciality}>&#8594;</button>
                </div>
                
                <div className="appointment-specialty-doctors ms-2">
                    <ul>
                        {store.doctors
                            .filter(doctor => doctor.especialidades.includes(store.selectedSpeciality))
                            .map(doctor => (
                                <li 
                                    key={doctor.id} 
                                    className={`appointment-doctor-item ${store.selectedDoctor === doctor.id ? "selected" : ""}`} 
                                    onClick={() => handleSelectDoctor(doctor.id)}
                                >
                                    {doctor.nombre} {doctor.apellido}
                                </li>
                            ))
                        }
                    </ul>
                </div>
                
                <div className="calendar-container">
                    {store.availability.length > 0 ? (
                        <div className="calendar">
                            {store.availability.map(slot => (
                                <div 
                                    key={`${slot.fecha}-${slot.hora_inicio}`} 
                                    className="calendar-day available" 
                                    onClick={() => handleSelectDay(slot.fecha)}
                                >
                                    {moment(slot.fecha).format("DD")}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-appointment-msg">No availability found</p>
                    )}
                </div>
                
                {store.selectedDate && store.availability.length > 0 && (
                    <div className="appointments-list">
                        <h3>Available Time Slots</h3>
                        {store.availability
                            .filter(slot => moment(slot.fecha).isSame(store.selectedDate, "day"))
                            .map(slot => (
                                <p key={`${slot.fecha}-${slot.hora_inicio}`} className="appointment-item">
                                    {slot.hora_inicio} - {slot.hora_final}
                                    <button className="schedule-button" onClick={() => handleReserveAppointment(slot.hora_inicio)}>
                                        Schedule
                                    </button>
                                </p>
                            ))
                        }
                    </div>
                )}
                
                <div className="appointments-list">
                    {store.appointments.length > 0 ? (
                        store.appointments.map(appt => (
                            <p key={appt.id} className="appointment-item">
                                {appt.appointment_date} {appt.appointment_time} - with Dr. {appt.doctorName || "Unknown"}
                                <button className="delete-button" onClick={() => handleCancelAppointment(appt.google_event_id)}>
                                    Cancel
                                </button>
                            </p>
                        ))
                    ) : (
                        <p className="no-appointment-msg">No appointments scheduled</p>
                    )}
                </div>
            </div>
        </>
    );
};
